package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/utils"
)


func GetCalendarEvents (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetCalendarEvents(index.(string), c)
}
/*
func AddCalendarEvent (c *gin.Context) {
	var form models.AddCalendarEvent;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.AddCalendarEventDB(index.(string), form, c)
} 

func DeleteCalendarEvent (c *gin.Context) {
	var form models.DeleteCalendarEvent;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.DeleteCalendarEventDB(index.(string), form, c)
}

func UpdateCalendarEvent (c *gin.Context) {
	var form models.UpdateCalendarEvent;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.UpdateCalendarEventDB(index.(string), form, c)
}
*/