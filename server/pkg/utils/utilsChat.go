package utils

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

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


	//create a new document in the collection chat with a vet of messages empty and a vet of users with the user that created the chat and the user that is going to be added

	type utente struct {
		IdUser string `bson:"idUser"`
		Image  string             `bson:"image"`
		Nickname string           `bson:"nickname"`
	}

	utente1 := utente{
		IdUser: index,
		Image:  form.FirstImg,
		Nickname: form.FirstNickname,
	}

	utente2 := utente{
		IdUser: form.IdUser,
		Image:  form.SecondImg,
		Nickname: form.SecondNickname,
	}

	utenti := []utente{utente1, utente2}
	//insert saving the id of the chat created
	ris2, err := collection.InsertOne(c.Request.Context(), bson.M{
			"messages":  []bson.M{},
			"users":     utenti,
			"flagGroup": false,
		})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//get the id of the chat created
	idChat := ris2.InsertedID.(primitive.ObjectID).Hex()

	

	//update the user collection adding the chat created
	collectionUser := config.ClientMongoDB.Database("user").Collection("user")
	if collectionUser == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	ris := collectionUser.FindOne(c.Request.Context(), bson.M{"_id": objID})
	if ris == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	// Extract the "chat" array from the result
	result := bson.M{}
	ris.Decode(&result)

	// Extract the "chat" array from the result
	chat := result["ids"].(primitive.A)[0].(primitive.M)["chats"].(primitive.A)

	// Add the chat to the array
	chat = append(chat, idChat)

	// Update the document
	_, err = collectionUser.UpdateOne(c.Request.Context(), bson.M{"_id": objID}, bson.M{"$set": bson.M{"ids.0.chats": chat}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//update the user collection adding the chat created
	
	objID2, err := primitive.ObjectIDFromHex(form.IdUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}

	ris3 := collectionUser.FindOne(c.Request.Context(), bson.M{"_id": objID2})
	if ris3 == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	// Extract the "chat" array from the result
	result2 := bson.M{}
	ris3.Decode(&result2)

	// Extract the "chat" array from the result

	chat2 := result2["ids"].(primitive.A)[0].(primitive.M)["chats"].(primitive.A)

	// Add the chat to the array

	chat2 = append(chat2, idChat)

	// Update the document

	_, err = collectionUser.UpdateOne(c.Request.Context(), bson.M{"_id": objID2}, bson.M{"$set": bson.M{"ids.0.chats": chat2}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}


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
	if chatJSON["chats"] != nil {
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
	} else {
		c.JSON(http.StatusOK, gin.H{
			"chats": []string{},
		})
	}
}


func GetMessages (index string, form models.GetMessages, c *gin.Context) {
	//get all the messages of a chat

	collection := config.ClientMongoDB.Database("chat").Collection("chat")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(form.IdChat)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID11",
		})
		return
	}
	fmt.Println(form.Offset)
	fmt.Println(objID)

		pipeline := bson.A{
			bson.M{
				"$match": bson.M{
					"_id": objID,
				},
			},
			bson.M{
				"$project": bson.M{
					"messages": 1,
					"_id":      0,
				},
			},
			bson.M{
				"$unwind": bson.M{
					"path": "$messages",
				},
			},
			bson.M{
				"$sort": bson.M{
					"messages.dateTime": -1,
				},
			},
			bson.M{
				"$skip": (form.Offset -1) * 50,
			},
			bson.M{
				"$limit": 50,
			},
		}
		
		cursor, err := collection.Aggregate(context.Background(), pipeline)
		if err != nil {
			fmt.Println(err)
		}
		defer cursor.Close(context.Background())

		var messages []bson.M
		
		for cursor.Next(context.Background()) {
			var result bson.M
			err := cursor.Decode(&result)
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(result)
			//push the messages in the array
			messages = append(messages, result)
			
		}
		if err := cursor.Err(); err != nil {
			fmt.Println(err)
		}
		c.JSON(http.StatusOK, gin.H{
			"messages": messages,
		})
		//send the messages to the client
		

}


func GetUsersFromGroup (idGroup string) [] string{
	//get all the users from a group

	collection := config.ClientMongoDB.Database("chat").Collection("chat")
	if collection == nil {
		errConn()
		return nil
	}

	objID, err := primitive.ObjectIDFromHex(idGroup)
	if err != nil {
		errConn()
		return nil
	}

	opt := options.FindOne().SetProjection(bson.M{"users": 1})

	var result7 bson.M
	ris7 := collection.FindOne(context.Background(), bson.M{"_id": objID}, opt)
	ris7.Decode(&result7)
	if result7 == nil {
		errConn()
		return nil
	}
	// Extract the "chat" array from the result7
	utenti := result7["users"].(primitive.A)
	//convert to string array
	users := make([]string, len(utenti))

	for i, elem := range utenti {
		users[i] = fmt.Sprintf("%v", elem)
	}

	//each users contains image, name and id. We need only the id
	for i, elem := range users {
		users[i] = strings.Split(elem, " ")[0]
	}

	//rn is an array of map with idUser:id. i just want an array of id like ["id1", "id2", "id3"]
	for i, elem := range users {
		users[i] = strings.Split(elem, ":")[1]
	}

	fmt.Println(users)
	return users
}

func SaveMessage(request models.Request) {
	//save the message in the database

	collection := config.ClientMongoDB.Database("chat").Collection("chat")
	if collection == nil {
		errConn()
		return
	}

	objID, err := primitive.ObjectIDFromHex(request.IdDest)
	if err != nil {
		errConn()
		return
	}

	//create the message
	message := bson.M{
		"dateTime": time.Now(),
		"content":  request.Payload,
		"idUser":   request.Index,
		"type" : request.TypeMSG,
	}
	if request.Options != "" {
		message["options"] = request.Options
	}

	//update the chat
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$push": bson.M{"messages": message}})
	if err != nil {
		errConn()
		return
	}

}
