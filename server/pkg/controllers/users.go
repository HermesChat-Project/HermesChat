package controllers

import (
	"github.com/gin-gonic/gin"
	"chat/pkg/utils"

	"fmt"
)
	

func SendFriendRequest (c *gin.Context) {
	fIndex := c.PostForm("index")
	if fIndex == "" {
		err := fmt.Errorf("id not found")
		utils.SendError(c, err)
		c.Abort();
		return
	}

	
	
}

func UpdateInfo (c *gin.Context) {
	//get the id from the user in the "username"
	id := utils.GetId(c.PostForm("username"));
	if id == "" {
		err := fmt.Errorf("username not found")
		utils.SendError(c, err)
		c.Abort();
		return
	}
}
