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
	"strings"

	"chat/pkg/config"
)

const infoUser = "Hey I'm using HermesChat"

func CreateToken (username string, c *gin.Context) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": username,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})
	
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(config.SECRET))

	if err != nil {
		errr := fmt.Errorf("error while connecting to database")
		sendError(c, errr)
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
		if (c.Request.URL.Path == "/login" || c.Request.URL.Path == "/signup") {
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
		sendError(c, errr)
		go config.WriteFileLog(err)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["sub"], claims["exp"])
		c.Set("username", claims["sub"])
		c.Next()
		return
	} else {
		errr := fmt.Errorf("error while connecting to database")
		sendError(c, errr)
		go config.WriteFileLog(err)
		return
	}
}

func LoginMongoDB (username string, password string, c *gin.Context) {
	if config.ClientMongoDB == nil {
		errr := fmt.Errorf("error while connecting to database")
		sendError(c, errr)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errr := fmt.Errorf("error while connecting to database")
		sendError(c, errr)
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errr := fmt.Errorf("username not found")
		sendError(c, errr)
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(result["password"].(string)), []byte(password))
	if err != nil {
		errr := fmt.Errorf("wrong password")
		sendError(c, errr)
		return
	}
	CreateToken(username, c)
	
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
			sendError(c, err)
		}
}
func checkEmail(email string, username string, password string, c *gin.Context) {
	//check that email is an email
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		err := fmt.Errorf("email not valid")
		sendError(c, err)
		return
	}
	if config.ClientMongoDB == nil {
		err := fmt.Errorf("error while connecting to database")
		sendError(c, err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		sendError(c, err)
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"email": email})
	var result bson.M
	ris.Decode(&result)
	if result != nil {
		err := fmt.Errorf("email already exists")
		sendError(c, err)
		return
	}
	checkUsername(username, password, email, c)
}
func checkUsername (username string, password string, email string, c *gin.Context) {
	if len(username) < 3 || len(username) > 20 {
		err := fmt.Errorf("username not found")
		sendError(c, err)
		return
	}	
	if config.ClientMongoDB == nil {
		err := fmt.Errorf("error while connecting to database")
		sendError(c, err)
		return
	}
	found := searchUser(username)
	if found {
		err := fmt.Errorf("username already exists")
		sendError(c, err)
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		err := fmt.Errorf("error while generating hash")
		sendError(c, err)
		go config.WriteFileLog(err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		sendError(c, err)
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

func sendError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"message": err.Error(),
	})
}
