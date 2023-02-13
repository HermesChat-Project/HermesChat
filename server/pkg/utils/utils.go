package utils 

import (
	"github.com/golang-jwt/jwt/v4"
	"time"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"

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
			"error": err.Error(),
		})
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600 * 24 * 30, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"ris": "Token created",
	})

}

