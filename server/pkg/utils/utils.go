package utils 

import (
	"github.com/golang-jwt/jwt/v4"
	"time"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"unicode"

	"chat/pkg/config"
)

func CreateToken (username string, c *gin.Context) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": username,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(config.SECRET))

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while creating token",
		})
		go config.WriteFileLog(err)
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600 * 24 * 30, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"ris": "Token created",
	})
}

func LoginMongoDB (username string, password string, c *gin.Context) {
	if config.ClientMongoDB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while connecting to database",
		})
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while connecting to database",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Username not found",
		})
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(result["password"].(string)), []byte(password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Wrong password",
		})
		return
	}
	CreateToken(username, c)
	
}

func VerifyPassword(s string, u string, c *gin.Context){
	//7 or more characters, at least one letter and one number and one special character and one uppercase letter
		var (
			hasMinLen  = false
			hasUpper   = false
			hasLower   = false
			hasNumber  = false
			hasSpecial = false
		)
		if len(s) >= 7 {
			hasMinLen = true
		}
		for _, char := range s {
			switch {
			case unicode.IsUpper(char):
				hasUpper = true
			case unicode.IsLower(char):
				hasLower = true
			case unicode.IsNumber(char):
				hasNumber = true
			case unicode.IsPunct(char) || unicode.IsSymbol(char):
				hasSpecial = true
			}
		}
		if hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial{
			checkUsername(u, s, c)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Password not valid",
			})
		}
}

func checkUsername (username string, password string, c *gin.Context) {
	if len(username) < 3 || len(username) > 20 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Username not valid",
		})
		return
	}	
	if config.ClientMongoDB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while connecting to database",
		})
		return
	}
	found := searchUser(username)
	if found {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Username already exists",
		})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while generating password",
		})
		go config.WriteFileLog(err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while connecting to database",
		})
		err := fmt.Errorf("error while connecting to database")
		go config.WriteFileLog(err)
		return
	}
	collection.InsertOne(
		context.Background(), 
		bson.M{
			"nickname": username, 
			"password": hash,
		},
	)
}

func searchUser (username string) bool {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		go config.WriteFileLog(err)
		return true
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	return result != nil
}

