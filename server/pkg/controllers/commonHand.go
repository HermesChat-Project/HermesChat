package controllers 

import (
	"github.com/gin-gonic/gin"
	"fmt"
	"chat/pkg/utils"
)

func Login(c *gin.Context) {
	c.Request.ParseForm()
	username := c.Request.Form.Get("username")
	password := c.Request.Form.Get("password")
	fmt.Println("username:", username, "password:", password)

	utils.LoginMongoDB(username, password, c)

}

func SignUp (c *gin.Context) {
	c.Request.ParseForm()
	username := c.Request.Form.Get("username")
	password := c.Request.Form.Get("password")
	fmt.Println("username:", username, "password:", password)

	c.JSON(200, gin.H{
		"username": username,
		"password": password,
	})

}