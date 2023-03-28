package controllers 

import (
	"github.com/gin-gonic/gin"
	"fmt"

	"chat/pkg/utils"
	"chat/pkg/models"
)
func Login(c *gin.Context) {
	c.Request.ParseForm()
	var form models.LoginRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("username:", form.Username, "password:", form.Password)

	utils.LoginMongoDB(form.Username, form.Password, c)

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