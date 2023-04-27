package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"

	"chat/pkg/config"
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