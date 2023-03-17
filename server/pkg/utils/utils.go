package utils

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"

	"chat/pkg/config"
)

const infoUser = "Hey I'm using HermesChat"

func CreateToken (index string, c *gin.Context) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": index,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(config.SECRET))

	if err != nil {
		errr := fmt.Errorf("error while creating token")
		SendError(c, errr)
		go config.WriteFileLog(err)
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600 * 24 * 30, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"ris": "Token created",
	})
}

func VerifyToken (c *gin.Context){
	cookie, err := c.Cookie("Authorization")
	if err != nil {
		go config.WriteFileLog(err)
		//redirect to login page
		if (c.Request.URL.Path == "/login" || c.Request.URL.Path == "/signup" || c.Request.URL.Path == "/favicon.ico") {
			c.Next()
		}else{
			c.JSON(http.StatusUnauthorized, gin.H{
				"ris": "Unauthorized",
			})
			c.Abort()
		}
		return
	}
	token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there was an error")
		}
		return []byte(config.SECRET), nil
	})
	if err != nil {
		errr := fmt.Errorf("error while connecting to database")
		SendError(c, errr)
		go config.WriteFileLog(err)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["sub"], claims["exp"])
		c.Set("index", claims["sub"])
		c.Next()
		return
	} else {
		errr := fmt.Errorf("error while connecting to database")
		SendError(c, errr)
		go config.WriteFileLog(err)
		return
	}
}

func LoginMongoDB (username string, password string, c *gin.Context) {
	if config.ClientMongoDB == nil {
		errr := fmt.Errorf("error while connecting to database")
		SendError(c, errr)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errr := fmt.Errorf("error while connecting to database")
		SendError(c, errr)
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errr := fmt.Errorf("username not found")
		SendError(c, errr)
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(result["password"].(string)), []byte(password))
	if err != nil {
		errr := fmt.Errorf("wrong password")
		SendError(c, errr)
		return
	}
	CreateToken(result["_id"].(primitive.ObjectID).Hex(), c)	
}

func VerifyPassword(s string, u string, e string,c *gin.Context){
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
			checkEmail(e, u, s, c)
		} else {
			err := fmt.Errorf("password not valid")
			SendError(c, err)
		}
}
func checkEmail(email string, username string, password string, c *gin.Context) {
	//check that email is an email
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		err := fmt.Errorf("email not valid")
		SendError(c, err)
		return
	}
	if config.ClientMongoDB == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"email": email})
	var result bson.M
	ris.Decode(&result)
	if result != nil {
		err := fmt.Errorf("email already exists")
		SendError(c, err)
		return
	}
	checkUsername(username, password, email, c)
}
func checkUsername (username string, password string, email string, c *gin.Context) {
	if len(username) < 3 || len(username) > 20 {
		err := fmt.Errorf("username not found")
		SendError(c, err)
		return
	}	
	if config.ClientMongoDB == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		return
	}
	found := searchUser(username)
	if found {
		err := fmt.Errorf("username already exists")
		SendError(c, err)
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		err := fmt.Errorf("error while generating hash")
		SendError(c, err)
		go config.WriteFileLog(err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		errConn();
		return
	}
	collection.InsertOne(
		context.Background(), 
		bson.M{
			"nickname": username, 
			"email" : email,
			"password": string(hash),
			"visible": true,
			"info": infoUser,
			"language": "it",
		},
	)
}

func searchUser (username string) bool {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn();
		return true
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	return result != nil
}

func errConn() {
	err := fmt.Errorf("error while connecting to database")
	go config.WriteFileLog(err)
}

func SendError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"message": err.Error(),
	})
}

func GetId (u string) string{
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn();
		return ""
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": u})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn();
		return ""
	}
	return result["_id"].(primitive.ObjectID).Hex()
}