package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"

	"chat/pkg/config"
	"chat/pkg/models"
)

func GetCalendarEvents(index string, c *gin.Context) {
	//get all the events created by the user

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//search every event if has the field idUser = index

	events := []bson.M{}
	cursor, err := collection.Find(c.Request.Context(), bson.M{"idUser": index})
	if err != nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while getting events",
		})
		return
	}
	if err = cursor.All(c.Request.Context(), &events); err != nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while getting events",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
	})

}

func AddCalendarEventDB (index string, form models.AddCalendarEvent, c *gin.Context) {
	//add a new event to the calendar

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//add the event to the database

	_, err := collection.InsertOne(c.Request.Context(), bson.M{"title": form.Title, "description": form.Description, "dateTime": form.Date, "type" : form.Type, "notify" : form.Notify, "notifyTime" : form.NotifyTime, "color" : form.Color, "idUser" : index, "idChats" : form.IdChats })
	if err != nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while adding event",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ris": "event added",
	})
}