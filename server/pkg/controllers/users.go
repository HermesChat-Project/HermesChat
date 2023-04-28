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
	index, _ := c.Get("index")

	utils.SendFriendRequestDB(index.(string), form.Username, c)
	
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

func GetFriendRequests (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetFriendRequestsDB(index.(string), c)
}

func GetBlocked(c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetBlockedDB(index.(string), c)
}

func BlockUser (c *gin.Context) {
	var form models.BlockUser;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.BlockUserDB(index.(string), form.Username, c)
}

func GetRequestSent (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetRequestSentDB(index.(string), c)
}

func AcceptFriendRequest (c *gin.Context) {
	var form models.AcceptFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.AcceptFriendRequestDB(index.(string), form, c)
}