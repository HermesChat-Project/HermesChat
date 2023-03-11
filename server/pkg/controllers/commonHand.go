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
	email := c.Request.Form.Get("email")
	fmt.Println("username:", username, "password:", password)
	//check if password respect requirements
	utils.VerifyPassword(password, username, email, c)
}