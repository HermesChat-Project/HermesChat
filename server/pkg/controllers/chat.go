package controllers 

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/utils"
	"chat/pkg/models"
)

func CreateChat (c *gin.Context) {
	var form models.CreateChat;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.CreateChat(index.(string), form, c)
}
