package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
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
	index, _ := c.Get("index")

	utils.UpdateInfoDB(index.(string), form.NewInfo, c)

}

func GetFriends (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetFriendsDB(index.(string), c)
}