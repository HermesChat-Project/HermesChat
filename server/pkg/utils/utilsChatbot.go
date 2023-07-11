package utils

import (
	"bytes"
	"chat/pkg/config"
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const apiURL = "https://api.openai.com/v1/chat/completions"

func SendRequestChatbot(index string, msg string, c *gin.Context) {
	collChatBot := config.ClientMongoDB.Database("user").Collection("chatBot")
	if collChatBot == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	objID, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	ris := collChatBot.FindOne(c.Request.Context(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//check the length of the message
	if len(msg) > 200 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "message too long",
		})
		return
	}

	if result["tries"] == 10 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "too many tries",
		})
		return
	}
	//create the message
	message := bson.M{
		"dateTime": time.Now(),
		"content":  msg,
		"idUser":   index,
	}
	result["tries"] = result["tries"].(int32) + 1
	result["messages"] = append(result["messages"].(primitive.A), message)

	//update the chat
	_, err = collChatBot.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": result})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	payload := map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{"role": "system", "content": "You are a helpful assistant."},
			{"role": "user", "content": msg},
		},
	}

	// Convert the payload to JSON
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal payload"})
		return
	}

	// Create the HTTP request
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	// Set the request headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+config.API_KEY_OPENAI)
	req.Header.Set("OpenAI-Organization", config.ORGANIZATION_ID_OPENAI)

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
		return
	}

	// Read the response body
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response body"})
		return
	}

	// Close the response body
	err = resp.Body.Close()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close response body"})
		return
	}

	// Handle the response
	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Request failed", "status": resp.Status})
		return
	}

	// Extract the generated message from the response
	var respData map[string]interface{}
	err = json.Unmarshal(respBody, &respData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal response"})
		return
	}

	messages := respData["choices"].([]interface{})[0].(map[string]interface{})["message"].(map[string]interface{})
	reply := messages["content"].(string)

	// Return the assistant's reply as the response
	c.JSON(http.StatusOK, gin.H{"reply": reply})
}
