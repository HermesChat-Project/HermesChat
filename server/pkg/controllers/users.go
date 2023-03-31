package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/utils"
	"chat/pkg/models"
)
	

func SendFriendRequest (c *gin.Context) {
	var form models.SendFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}	

	//utils.SendFriendRequestDB(form.Index, form.Username, c)
	
}

func UpdateInfo (c *gin.Context) {	
	var form models.UpdateInfo;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	utils.UpdateInfoDB(form.Index, form.NewInfo, c)

}

func GetFriends (c *gin.Context) {
	var form models.General;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	utils.GetFriendsDB(form.Index, c)
}