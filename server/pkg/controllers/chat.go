package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
)

// CreateChat godoc
// @Summary 			Crea una chat
// @Description 		Crea una chat tra due utenti
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    idUser formData string true "Id dell'utente con cui creare la chat"
// @Param				img formData file true "Immagine dell'utente loggato"
// @Param				friendImg formData file true "Immagine dell'utente con cui creare la chat"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /createChat [post]
func CreateChat (c *gin.Context) {
	var form models.CreateChat;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.CreateChat(index.(string), form, c)
}

// GetChats godoc
// @Summary 			Ottieni chat
// @Description 		Restituisce tutte le chat dell'utente loggato
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getChats [post]
func GetChats (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetChats(index.(string), c)
}

// GetMessages godoc
// @Summary 			Ottieni messaggi
// @Description 		Restituisce offset * 50 messaggi della chat selezionata 
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    idChat formData string true "Id della chat selezionata"
// @Param 			    offset formData string true "Offset dei messaggi da restituire"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getMessages [post]
func GetMessages (c *gin.Context){
	var form models.GetMessages;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetMessages(index.(string), form, c)
}