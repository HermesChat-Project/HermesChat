package utils

import (
	"fmt"
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

func DeleteCalendarEventDB (index string, form models.DeleteCalendarEvent, c *gin.Context) {
	//delete an event from the calendar

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//delete the event from the database

	_, err := collection.DeleteOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index})
	if err != nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while deleting event",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ris": "event deleted",
	})
}

func UpdateCalendarEventDB(index string, form models.UpdateCalendarEvent, c *gin.Context){
	//update an event from the calendar

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	if form.Title != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"title": "form.Title"}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Description != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"description": form.Description}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Date != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"dateTime": form.Date}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Type != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"type": form.Type}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Notify != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"notify": form.Notify}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.NotifyTime != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"notifyTime": form.NotifyTime}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Color != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$set": bson.M{"color": form.Color}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.IdChats != nil {
		//push the new chats ids in the array of the event
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": form.IdEvent, "idUser" : index}, bson.M{"$push": bson.M{"idChats": form.IdChats}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"ris": "event updated",
	})




}