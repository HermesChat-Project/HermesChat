package controllers

import (
	"github.com/gin-gonic/gin"
	"chat/pkg/utils"

	"fmt"
)
	

func AddFriend (c *gin.Context) {
	fName := c.PostForm("nickname")
	if fName == "" {
		err := fmt.Errorf("nickname not found")
		utils.SendError(c, err)
		c.Abort();
		return
	}

	//get the id from the user in the "username"
	id := utils.GetId(c.PostForm("username"));
	if id == "" {
		err := fmt.Errorf("username not found")
		utils.SendError(c, err)
		c.Abort();
		return
	}
	
}
