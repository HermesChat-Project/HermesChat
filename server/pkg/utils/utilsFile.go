package utils

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"mime"
	"mime/multipart"
	"net/http"
	"strings"
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
		
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		
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
	fmt.Println(len(files))
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
	//remove the first
	vetUrl = vetUrl[1:]
	c.JSON(http.StatusOK, gin.H{
		"url": vetUrl,
	})
}

func getExtension(header multipart.FileHeader) (string, error) {
	contentType := header.Header.Get("Content-Type")
	if contentType == "audio/mpeg" || strings.HasPrefix(contentType, "audio/mp3") {
		return ".mp3", nil
	}

	extensions, err := mime.ExtensionsByType(contentType)
	if err != nil {
		return "", err
	}

	if len(extensions) == 0 {
		return "", errors.New("extension not found")
	}

	return extensions[0], nil
}

func DownloadFile (index string, url string, chat string, c *gin.Context){
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		
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
		
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID8",
		})
		return
	}
	// Extract the "chat" array from the result7
	ids := result7["ids"].(primitive.A)
	fmt.Println("ids: ", ids)
	chatJSON := ids[0].(primitive.M)
	fmt.Println("chatJSON: ", chatJSON)

	vetChats := chatJSON["chats"].(primitive.A)
	fmt.Println("vetChats: ", vetChats)

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
		//read the content of the file
		filePath := "uploads/" + chat + "/" + url
		content, err := ioutil.ReadFile(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "error while opening file",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"content": content,
		})
    }
