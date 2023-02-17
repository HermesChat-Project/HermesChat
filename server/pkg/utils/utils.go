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


