package utils

import (
	"context"
	"fmt"
	"math/rand"
	"mime"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"chat/pkg/config"
)

func UploadFile(index string, chatID string, files []*multipart.FileHeader, c *gin.Context) {
	//check if in user db there is a chat with that id
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

	//se vetChats contiene chatID allora posso procedere
	procedi := false
	for _, elem := range vetChats {
		if fmt.Sprintf("%v", elem) == chatID {
			procedi = true
			break
		}
	}
	if !procedi {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "invalid chatID",
		})
		return
	}
	vetUrl := make([]string, len(files))
	for _, file := range files {
		fmt.Println(file.Filename)
		//get only the current second and nanosecond

		nanoseconds := time.Now().UnixNano()

		fileExt, _ := getExtension(*file)

		name := index + "_" + fmt.Sprintf("%d", nanoseconds) + "_" + fmt.Sprintf("%d", rand.Intn(100)) + fileExt
		c.SaveUploadedFile(file, "uploads/"+chatID+"/"+name)

		vetUrl = append(vetUrl, name)

	}
	c.JSON(http.StatusOK, gin.H{
		"url": vetUrl,
	})
}

func getExtension(header multipart.FileHeader) (string, error) {
	extension, err := mime.ExtensionsByType(header.Header.Get("Content-Type"))
	if err != nil {
		return "", err
	}
	return extension[0], nil
}

func DownloadFile (index string, urls []string, chats []string, c *gin.Context){
	if len(urls) != len(chats){
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request",
		})
		return
	}
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
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
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

	for _, chat := range chats {
		//se vetChats contiene chatID allora posso procedere
		procedi := false
		for _, elem := range vetChats {
			if fmt.Sprintf("%v", elem) == chat {
				procedi = true
				break
			}
		}
		if !procedi {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "invalid chatID",
			})
			return
		}
	}

	for i, url := range urls {
		c.File("uploads/"+chats[i]+"/"+url)
	}

	



}