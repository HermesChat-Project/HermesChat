package utils

import (
	"context"
	"fmt"
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
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//search every event if has the field idUser = index

	events := []bson.M{}
	cursor, err := collection.Find(c.Request.Context(), bson.M{"idUser": index})
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while getting events",
		})
		return
	}
	if err = cursor.All(c.Request.Context(), &events); err != nil {
		errConn()
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
				"$match": bson.M{
					"type": "shared",
				},
			},
			bson.M{
				"$unwind": bson.M{
					"path": "$idChats",
				},
			},
			bson.M{
				"$match": bson.M{
					"idChats": elem,
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
			if !check {
				events = append(events, elem2)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
	})

}

func AddCalendarEventDB(index string, form models.AddCalendarEvent, c *gin.Context) {
	//add a new event to the calendar

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//add the event to the database and save its id

	resInsert, err := collection.InsertOne(c.Request.Context(), bson.M{"title": form.Title, "description": form.Description, "dateTime": form.Date, "type": form.Type, "notify": form.Notify, "notifyTime": form.NotifyTime, "color": form.Color, "idUser": index, "idChats": form.IdChats})
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while adding event",
		})
		return
	}

	form.IdCalendar = resInsert.InsertedID.(primitive.ObjectID).Hex()
	
	vetAus := []string{}
	vetAus = append(vetAus, index)
	if form.Type == "shared" {
		//for each chat get users, if they are not who added the event, send them a notification via websocket
		
		for _, elem := range form.IdChats {
			collection2 := config.ClientMongoDB.Database("chat").Collection("chat")
			if collection2 == nil {
				errConn()
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "error while connecting to database",
				})
				return
			}

			objID, err := primitive.ObjectIDFromHex(elem)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "invalid ObjectID",
				})
				return
			}

			ris := collection2.FindOne(context.Background(), bson.M{"_id": objID})
			if ris == nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "invalid ObjectID",
				})
				return
			}
			var result bson.M
			ris.Decode(&result)

			// Extract the "users" array from the result
			users := result["users"].(primitive.A)

			for _, elem2 := range users {
				check := false
				for _, elem3 := range vetAus {
					if elem2 == elem3 {
						check = true
					}
				}
				if !check {
					vetAus = append(vetAus, elem2.(string))
				}
			}
		}
	}
	for _, elem2 := range vetAus {
		type Message struct {
			Type     string                  `json:"type"`
			Username string                  `json:"username"`
			Event    models.AddCalendarEvent `json:"event"`
		}

		msg := Message{Type: "CEA", Username: index, Event: form}
		fmt.Println(msg)
		connsId := config.GetUserConnectionsRedis(elem2)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != nil {
				connDest.WriteJSON(msg)
			}
		}

	}
}

func DeleteCalendarEventDB(index string, form models.DeleteCalendarEvent, c *gin.Context) {
	//delete an event from the calendar

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//delete the event from the database

	objID, err := primitive.ObjectIDFromHex(form.IdEvent)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	//get the event for sending notifications
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID})
	if ris == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	var resultA bson.M
	ris.Decode(&resultA)

	_, err = collection.DeleteOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index})
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while deleting event",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ris": "event deleted",
	})

	if resultA["type"] == "shared" {
		//for each chat get users, if they are not who added the event, send them a notification via websocket
		for _, elem := range resultA["idChats"].(primitive.A) {
			collection2 := config.ClientMongoDB.Database("chat").Collection("chat")
			if collection2 == nil {
				errConn()
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "error while connecting to database",
				})
				return
			}

			objID, err := primitive.ObjectIDFromHex(elem.(string))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "invalid ObjectID",
				})
				return
			}

			ris := collection2.FindOne(context.Background(), bson.M{"_id": objID})
			if ris == nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "invalid ObjectID",
				})
				return
			}
			var result bson.M
			ris.Decode(&result)

			for _, elem2 := range result["users"].(primitive.A) {
				idel := elem2.(primitive.M)["idUser"].(string)
					type Message struct {
						Type     string `json:"type"`
						Username string `json:"username"`
						IdEvent  string `json:"idEvent"`
					}

					msg := Message{Type: "CED", Username: index, IdEvent: resultA["_id"].(string)}
					fmt.Println(msg)
					connsId := config.GetUserConnectionsRedis(idel)
					for _, connId := range connsId {
						connDest := config.Conns[connId]
						if connDest != nil {
							connDest.WriteJSON(msg)
						}
					}
			}
		}
	}
}

func UpdateCalendarEventDB(index string, form models.UpdateCalendarEvent, c *gin.Context) {
	//update an event from the calendar

	collection := config.ClientMongoDB.Database("chat").Collection("calendar")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(form.IdEvent)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	if form.Title != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"title": form.Title}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Description != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"description": form.Description}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Date != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"dateTime": form.Date}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Type != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"type": form.Type}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Notify != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"notify": form.Notify}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.NotifyTime != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"notifyTime": form.NotifyTime}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.Color != "" {
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$set": bson.M{"color": form.Color}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	if form.IdChats != nil {
		//push the new chats ids in the array of the event
		_, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID, "idUser": index}, bson.M{"$push": bson.M{"idChats": form.IdChats}})
		if err != nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
	}

	risChat, err := collection.Find(c.Request.Context(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while updating event",
		})
		return
	}
	var resultA bson.M
	risChat.Decode(&resultA)

	vetAus := []string{}
	vetAus = append(vetAus, index)
	for _, elem := range resultA["idChats"].(primitive.A) {
		idChat := elem.(primitive.M)["idChat"].(string)
		objIDChat, err := primitive.ObjectIDFromHex(idChat)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID",
			})
			return
		}
		risChat, err := config.ClientMongoDB.Database("chat").Collection("chats").Find(c.Request.Context(), bson.M{"_id": objIDChat})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while updating event",
			})
			return
		}
		var resultB bson.M
		risChat.Decode(&resultB)
		for _, elem := range resultB["idUsers"].(primitive.A) {
			check := false
			for _, elem2 := range vetAus {
				if elem2 == elem.(string) {
					check = true
				}
			}
			if !check{
				vetAus = append(vetAus, elem.(string))
			}
		}
	}

	for _, elem2 := range vetAus {
		type Message struct {
			Type     string                  `json:"type"`
			Username string                  `json:"username"`
			Event    models.UpdateCalendarEvent `json:"event"`
		}

		msg := Message{Type: "CEM", Username: index, Event: form}
		fmt.Println(msg)
		connsId := config.GetUserConnectionsRedis(elem2)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != nil {
				connDest.WriteJSON(msg)
			}
		}

	}



		

	c.JSON(http.StatusOK, gin.H{
		"ris": "event updated",
	})

}
