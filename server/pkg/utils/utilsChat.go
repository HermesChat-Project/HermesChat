package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"

	"chat/pkg/config"
	"chat/pkg/models"
)

func CreateChat (index string, form models.CreateChat, c *gin.Context) {
	collection := config.ClientMongoDB.Database("chat").Collection("chat")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID5",
		})
		return;
	}

	objID2, err := primitive.ObjectIDFromHex(form.IdUser)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID6",
		})
		return;
	}

	//create a new document in the collection chat with a vet of messages empty and a vet of users with the user that created the chat and the user that is going to be added

	type utente struct {
		IdUser primitive.ObjectID `bson:"idUser"`
		Image string `bson:"image"`
	}

	utente1 := utente{
		IdUser: objID,
		Image: form.FirstImg,
	}

	utente2 := utente{
		IdUser: objID2,
		Image: form.SecondImg,
	}

	utenti := []utente{utente1, utente2}

	collection.InsertOne(c.Request.Context(), bson.M{
		"messages": []bson.M{},
		"users": utenti,
		"flagGroup": false,
	})

	c.JSON(http.StatusOK, gin.H{
		"ris": "chat created",
	})


	

}