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

func CreateChat(index string, form models.CreateChat, c *gin.Context) {
	collection := config.ClientMongoDB.Database("chat").Collection("chat")
	if collection == nil {
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
			"message": "invalid ObjectID5",
		})
		return
	}

	objID2, err := primitive.ObjectIDFromHex(form.IdUser)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID6",
		})
		return
	}

	//create a new document in the collection chat with a vet of messages empty and a vet of users with the user that created the chat and the user that is going to be added

	type utente struct {
		IdUser primitive.ObjectID `bson:"idUser"`
		Image  string             `bson:"image"`
	}

	utente1 := utente{
		IdUser: objID,
		Image:  form.FirstImg,
	}

	utente2 := utente{
		IdUser: objID2,
		Image:  form.SecondImg,
	}

	utenti := []utente{utente1, utente2}

	collection.InsertOne(c.Request.Context(), bson.M{
		"messages":  []bson.M{},
		"users":     utenti,
		"flagGroup": false,
	})

	c.JSON(http.StatusOK, gin.H{
		"ris": "chat created",
	})
}

func GetChats(index string, c *gin.Context) {
	//get all the chats created by the user

	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
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

	var result7 bson.M
	ris7 := collection.FindOne(context.Background(), bson.M{"_id": objID}, opt)
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


	chatIDs := make([]string, len(vetChats))

	for i, elem := range vetChats {
		chatIDs[i] = fmt.Sprintf("%v", elem)
	}

	i := 0

	for _, elem := range chatIDs {
		i++;

		idChats, err := primitive.ObjectIDFromHex(elem)
		if err != nil {
			errConn()
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID9",
			})
			return
		}

		collection2 := config.ClientMongoDB.Database("chat").Collection("chat")
		if collection2 == nil {
			errConn()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}

		opt2 := options.FindOne().SetProjection(bson.M{"messages": 0})

		var result8 bson.M

		ris8 := collection2.FindOne(context.Background(), bson.M{"_id": idChats}, opt2)
		ris8.Decode(&result8)
		if result8 == nil {
			errConn()
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID10",
			})
			return
		}

		vetChats[i-1] = result8



	}

	c.JSON(http.StatusOK, gin.H{
		"chats": vetChats,
	})
}
