package utils

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

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

	//get user's chats

	collection2 := config.ClientMongoDB.Database("user").Collection("user")
	if collection2 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID7",
		})
		return
	}

	opt := options.FindOne().SetProjection(bson.M{"ids": 1})
	collection4 := config.ClientMongoDB.Database("user").Collection("user")
	var result7 bson.M
	ris7 := collection4.FindOne(context.Background(), bson.M{"_id": objID}, opt)
	ris7.Decode(&result7)
	if result7 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID8",
		})
		return
	}
	// Extract the "chat" array from the result7
	ids := result7["ids"].(primitive.A)
	chatJSON := ids[0].(primitive.M)

	vetChats := chatJSON["chats"].(primitive.A)

	for _, elem := range vetChats {
		//use elem to search in the collection user.calendar that has in the vet idChats the elem
		collection3 := config.ClientMongoDB.Database("chat").Collection("calendar")
		if collection3 == nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
		pipeline := bson.A{
			bson.M{
				"$match" : bson.M{
					"type" : "shared",
				},
			},
    		bson.M{
				"$unwind" : bson.M{
					"path" : "$idChats",
				},
			},
			bson.M{
				"$match" : bson.M{
					"idChats" : elem,
				},
			},
		}
		cursor, err := collection3.Aggregate(context.Background(), pipeline)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while getting events",
			})
			return
		}
		var result []bson.M
		if err = cursor.All(context.Background(), &result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while getting events",
			})
			return
		}
		for _, elem2 := range result {
			check := false
			for _, elem3 := range events {
				if elem2["_id"] == elem3["_id"] {
					check = true
				}
			}
			if !check{
				events = append(events, elem2)
			}
		}
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

	objID, err := primitive.ObjectIDFromHex(form.IdEvent)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	_, err = collection.DeleteOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index})
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

	objID, err := primitive.ObjectIDFromHex(form.IdEvent)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	if form.Title != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"title": form.Title}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Description != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"description": form.Description}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Date != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"dateTime": form.Date}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Type != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"type": form.Type}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Notify != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"notify": form.Notify}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.NotifyTime != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"notifyTime": form.NotifyTime}})
		if err != nil {
			errConn();
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Color != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$set": bson.M{"color": form.Color}})
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
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser" : index}, bson.M{"$push": bson.M{"idChats": form.IdChats}})
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