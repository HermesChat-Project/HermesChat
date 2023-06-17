package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
)

func SendRequestChatbot (c *gin.Context) {
	var form models.ChatBotRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	index, _ := c.Get("index")
	utils.SendRequestChatbot(index.(string), form.Msg, c)

}