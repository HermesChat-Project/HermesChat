package controllers 

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/utils"
	"chat/pkg/models"
)
func Login(c *gin.Context) {
	var form models.LoginRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	utils.LoginMongoDB(form.Username, form.Password, c)

}

func SignUp (c *gin.Context) {
	var form models.SignUpRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	//check if password respect requirements
	utils.VerifyPassword(form.Email, form.Username, form.Password, c)
}