package utils

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"chat/pkg/config"
	"chat/pkg/models"
)

func CreateGroupDB(idAdmin string, form models.CreateGroupRequest, c *gin.Context) {
	collectionChat := config.ClientMongoDB.Database("chat").Collection("chat")
	if collectionChat == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	type user struct {
		IdUser   string `bson:"idUser"`
		Image    string `bson:"image"`
		Nickname string `bson:"nickname"`
	}
	type grouppo struct {
		Users        []user   `bson:"users"`
		Messages     []string `bson:"messages"`
		CreationDate string   `bson:"creationDate"`
		FlagGroup    string   `bson:"flagGroup"`
		Description  string   `bson:"description"`
		Visibility   string   `bson:"visibility"`
		Img          string   `bson:"groupImage"`
		Name         string   `bson:"groupName"`
	}

	//create a new document in the collection chat with a vet of messages empty and a vet of users with the user that created the chat and the users that are going to be added
	collectionUser := config.ClientMongoDB.Database("chat").Collection("user")
	if collectionUser == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID, errObj := primitive.ObjectIDFromHex(idAdmin)
	if errObj != nil {
	c.JSON(http.StatusBadRequest, gin.H{
		"message": "invalid ObjectID2",
	})
	return
	}
	ris := collectionUser.FindOne(c, bson.M{"_id": objID})
	if ris == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	var result user
	err := ris.Decode(&result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	var users []user
	var messages []string
	var group grouppo
	group.Messages = messages
	group.CreationDate = time.Now().Format("2019-03-12T15:00:00.000Z")
	//group.FlagGroup = form.FlagGroup
	group.Description = form.Description
	//group.Visibility = form.Visibility
	group.Img = form.Img
	group.Name = form.Name

	var utente user
	utente.IdUser = idAdmin
	utente.Image = result.Image
	utente.Nickname = result.Nickname

	users = append(users, utente)

	for _, element := range form.Users {
		objUser, errObj := primitive.ObjectIDFromHex(element)
		if errObj != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID2",
			})
			return
		}
		ris := collectionUser.FindOne(c, bson.M{"_id": objUser})
		if ris == nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
		var result user
		err := ris.Decode(&result)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
		var utente user
		utente.IdUser = element
		utente.Image = result.Image
		utente.Nickname = result.Nickname
		users = append(users, utente)
	}

	group.Users = users
	group.FlagGroup = "true"
	group.Visibility = "true"

	id, err := collectionChat.InsertOne(c.Request.Context(), group)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	//aggiungo il gruppo alla lista dei gruppi dell'utente

	for _, element := range form.Users {
		objUser, errObj := primitive.ObjectIDFromHex(element)
		if errObj != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID2",
			})
			return
		}
		ris3 := collectionUser.FindOne(c.Request.Context(), bson.M{"_id": objUser})
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

		chat2 = append(chat2, id.InsertedID.(primitive.ObjectID))

		// Update the document

		_, err = collectionUser.UpdateOne(c.Request.Context(), bson.M{"_id": objUser}, bson.M{"$set": bson.M{"ids.0.chats": chat2}})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
	}

	for _, friend := range form.Users {

		type Message struct {
			Type     string `json:"type"`
			ChatId   string `json:"chatId"`
			Name    string `json:"name"`
			Img    string `json:"img"`
			Description    string `json:"description"`
			Users	[]user `json:"users"`
			Payload  string `json:"payload"`
		}

		msg := Message{Type: "CNG", ChatId: id.InsertedID.(primitive.ObjectID).Hex(), Name: form.Name, Img: form.Img, Description: form.Description, Users: users, Payload: "new group created"}
		fmt.Println(msg)
		connsId := config.GetUserConnectionsRedis(friend)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != nil {
				connDest.WriteJSON(msg)
			}
		}
	}

}

func AddUserToGroupDB (idadmin string, form models.AddUserToGroupRequest, c *gin.Context){
	objGroup , errObj := primitive.ObjectIDFromHex(form.ChatId)
	if errObj != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	collecChat := config.ClientMongoDB.Database("chat").Collection("chat")
	if collecChat == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	ris1 := collecChat.FindOne(c.Request.Context(), bson.M{"_id": objGroup})
	if ris1 == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	type user struct {
		IdUser string `json:"idUser" bson:"idUser"`
		Role string `json:"role" bson:"role"`
		Nickname string `json:"nickname" bson:"nickname"`
		Image string `json:"image" bson:"image"`
	}

	type group struct {
		Users []user `json:"users" bson:"users"`
	}
	var result1 group 
	err := ris1.Decode(&result1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	
	//check if the id of the admin is in the array of users and his "role" is "admin"
	var flag bool = false
	for _, element := range result1.Users {
		if element.IdUser == idadmin && element.Role == "admin" {
			flag = true
		}
	}
	if !flag {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	var gruppo2 group
	collectionUser := config.ClientMongoDB.Database("chat").Collection("user")
	if collectionUser == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	for _, userActual := range form.Users{
		objUtente , errObj := primitive.ObjectIDFromHex(userActual)
		if errObj != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID2",
			})
			return
		}
		ris3 := collectionUser.FindOne(c.Request.Context(), bson.M{"_id": objUtente})
		if ris3 == nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
		_, errUpload := collectionUser.UpdateOne(c.Request.Context(), bson.M{"_id": objUtente}, bson.M{"$push": bson.M{"ids.0.chats": objGroup}})
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}

		var result2 user
		err := ris3.Decode(&result2)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
		var utente user
		utente.IdUser = userActual
		utente.Image = result2.Image
		utente.Nickname = result2.Nickname
		utente.Role = "normal"

		gruppo2.Users = append(gruppo2.Users, utente)

	}

	//aggiungo il gruppo alla lista dei gruppi dell'utente
	_, errUpload := collecChat.UpdateOne(c.Request.Context(), bson.M{"_id": objGroup}, bson.M{"$push": bson.M{"users": gruppo2.Users}})
	if errUpload != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	for _, friend := range form.Users {

		type Message struct {
			Type     string `json:"type"`
			ChatId   string `json:"chatId"`
			Info     string `json:"info"`
		}

		msg := Message{Type: "ATG", ChatId: form.ChatId, Info: "you have been added to the group"}
		fmt.Println(msg)
		connsId := config.GetUserConnectionsRedis(friend)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != nil {
				connDest.WriteJSON(msg)
			}
		}
	}
	
}

func ChangeRoleGroupDB (idAdmin string, form models.ChangeRoleGroup, c *gin.Context){
	
	objGroup , errObj := primitive.ObjectIDFromHex(form.ChatId)
	if errObj != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	collecChat := config.ClientMongoDB.Database("chat").Collection("chat")
	if collecChat == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//search the group and get the array of users
	ris1 := collecChat.FindOne(c.Request.Context(), bson.M{"_id": objGroup})
	if ris1 == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	type user struct {
		IdUser string `json:"idUser" bson:"idUser"`
		Role string `json:"role" bson:"role"`
		Nickname string `json:"nickname" bson:"nickname"`
		Image string `json:"image" bson:"image"`
	}
	type group struct {
		Users []user `json:"users" bson:"users"`
	}
	var result1 group
	err := ris1.Decode(&result1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	isAdmin := false
	for _, element := range result1.Users {
		if element.IdUser == idAdmin && element.Role == "admin" {
			isAdmin = true
		}
	}
	if !isAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "not an admin",
		})
		return
	}

	//update the user that has "user" id as idUser with the new role
	for _, element := range result1.Users {
		if element.IdUser == form.User {
			element.Role = form.Role
		}
	}
	_, errUpload := collecChat.UpdateOne(c.Request.Context(), bson.M{"_id": objGroup}, bson.M{"$set": bson.M{"users": result1.Users}})
	if errUpload != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	type Message struct {
		Type     string `json:"type"`
		ChatId   string `json:"chatId"`
		Info     string `json:"info"`
	}

	msg := Message{Type: "CRG", ChatId: form.ChatId, Info: "your role has been changed"}
	fmt.Println(msg)
	connsId := config.GetUserConnectionsRedis(form.User)
	for _, connId := range connsId {
		connDest := config.Conns[connId]
		if connDest != nil {
			connDest.WriteJSON(msg)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "role changed successfully",
	})
}

func RemoveUserFromGroupDB (idAdmin string, form models.RemoveUserFromGroupRequest, c *gin.Context){
	objGroup , errObj := primitive.ObjectIDFromHex(form.ChatId)
	if errObj != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	collecChat := config.ClientMongoDB.Database("chat").Collection("chat")
	if collecChat == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//search the group and get the array of users
	ris1 := collecChat.FindOne(c.Request.Context(), bson.M{"_id": objGroup})
	if ris1 == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	type user struct {
		IdUser string `json:"idUser" bson:"idUser"`
		Role string `json:"role" bson:"role"`
	}
	type group struct {
		Users []user `json:"users" bson:"users"`
	}
	var result1 group
	err := ris1.Decode(&result1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	isAdmin := false
	for _, element := range result1.Users {
		if element.IdUser == idAdmin && element.Role == "admin" {
			isAdmin = true
		}
	}
	if !isAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "not an admin",
		})
		return
	}
	for _, element := range result1.Users {
		if element.IdUser == form.UserId {
			_, errUpload := collecChat.UpdateOne(c.Request.Context(), bson.M{"_id": objGroup}, bson.M{"$pull": bson.M{"users": bson.M{"idUser": form.UserId}}})
			if errUpload != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "error while connecting to database",
				})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"message": "user removed successfully",
			})
			return
		}
	}
	c.JSON(http.StatusBadRequest, gin.H{
		"message": "user not found",
	})

	//get the user with the idUser and remove the group from his list of groups
	objUser , errObj := primitive.ObjectIDFromHex(form.UserId)
	if errObj != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	collecUser := config.ClientMongoDB.Database("chat").Collection("user")
	if collecUser == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	opt := options.FindOne().SetProjection(bson.M{"ids": 1})

	var result7 bson.M
	ris7 := collecUser.FindOne(c.Request.Context(), bson.M{"_id": objUser}, opt)
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
	//remove the group from the user's list of groups
	for _, element := range chatIDs {
		if element == form.ChatId {
			_, errUpload := collecUser.UpdateOne(c.Request.Context(), bson.M{"_id": objUser}, bson.M{"$pull": bson.M{"ids.0.chats": bson.M{"$in": []string{form.ChatId}}}})
			if errUpload != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "error while connecting to database",
				})
				return
			}
		}
	}

	type Message struct {
		Type     string `json:"type"`
		ChatId   string `json:"chatId"`
		Info     string `json:"info"`
	}

	msg := Message{Type: "RFG", ChatId: form.ChatId, Info: "you have been removed from the group"}
	fmt.Println(msg)
	connsId := config.GetUserConnectionsRedis(form.UserId)
	for _, connId := range connsId {
		connDest := config.Conns[connId]
		if connDest != nil {
			connDest.WriteJSON(msg)
		}
	}
}

}

func DeleteGroupDB (idUser string, chatId string, c *gin.Context){
    objChat , errObj := primitive.ObjectIDFromHex(chatId)
	if errObj != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	collecChat := config.ClientMongoDB.Database("chat").Collection("chat")
	if collecChat == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//search the group and get the array of users
	ris1 := collecChat.FindOne(c.Request.Context(), bson.M{"_id": objChat})
	if ris1 == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	type user struct {
		IdUser string `json:"idUser" bson:"idUser"`
		Role string `json:"role" bson:"role"`
	}
	type group struct {
		Users []user `json:"users" bson:"users"`
	}
	var result1 group
	err := ris1.Decode(&result1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	isAdmin := false
	for _, element := range result1.Users {
		if element.IdUser == idUser && element.Role == "admin" {
			isAdmin = true
		}
	}
	if !isAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "not an admin",
		})
		return
	}
	//remove the group from the user's list of groups
	collecUser := config.ClientMongoDB.Database("chat").Collection("user")
	if collecUser == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	for _, elem := range result1.Users {
		objUser , errObj := primitive.ObjectIDFromHex(elem.IdUser)
		if errObj != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid ObjectID2",
			})
			return
		}
		_, errUpload := collecUser.UpdateOne(c.Request.Context(), bson.M{"_id": objUser}, bson.M{"$pull": bson.M{"ids.0.chats": bson.M{"$in": []string{chatId}}}})
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}

		type Message struct {
			Type     string `json:"type"`
			ChatId   string `json:"chatId"`
			Info     string `json:"info"`
		}

		msg := Message{Type: "DGC", ChatId: chatId, Info: "the group has been deleted"}
		fmt.Println(msg)
		connsId := config.GetUserConnectionsRedis(elem.IdUser)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != nil {
				connDest.WriteJSON(msg)
			}
		}
	}
	//remove the group from the database
	_, errUpload := collecChat.DeleteOne(c.Request.Context(), bson.M{"_id": objChat})
	if errUpload != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "group deleted successfully",
	})
}

func ChangeGroupInfoDB (index string, form models.ChangeGroupInfoRequest, c *gin.Context){
	objChat , errObj := primitive.ObjectIDFromHex(form.ChatId)
	if errObj != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	collecChat := config.ClientMongoDB.Database("chat").Collection("chat")
	if collecChat == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//search the group and get the array of users
	ris1 := collecChat.FindOne(c.Request.Context(), bson.M{"_id": objChat})
	if ris1 == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	type user struct {
		IdUser string `json:"idUser" bson:"idUser"`
		Role string `json:"role" bson:"role"`
	}
	type group struct {
		Users []user `json:"users" bson:"users"`
	}
	var result1 group
	err := ris1.Decode(&result1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	isAdmin := false
	for _, element := range result1.Users {
		if element.IdUser == index && element.Role == "admin" {
			isAdmin = true
		}
	}
	if !isAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "not an admin",
		})
		return
	}
	if form.Name != "" {
		_, errUpload := collecChat.UpdateOne(c.Request.Context(), bson.M{"_id": objChat}, bson.M{"$set": bson.M{"name": form.Name}})
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
	}
	if form.Description != "" {
		_, errUpload := collecChat.UpdateOne(c.Request.Context(), bson.M{"_id": objChat}, bson.M{"$set": bson.M{"description": form.Description}})
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
	}
	if form.Img != "" {
		_, errUpload := collecChat.UpdateOne(c.Request.Context(), bson.M{"_id": objChat}, bson.M{"$set": bson.M{"image": form.Img}})
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while connecting to database",
			})
			return
		}
	}

	

}