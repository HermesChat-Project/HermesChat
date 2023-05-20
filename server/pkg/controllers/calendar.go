package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
)

// GetCalendarEvents	godoc
// @Summary 			Ottiene eventi del calendario
// @Description 		Restituisce tutti gli eventi del calendario dell'utente loggato (sia personali che condivisi)
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getCalendarEvents [post]
func GetCalendarEvents(c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetCalendarEvents(index.(string), c)
}

// AddCalendarEvent	godoc
// @Summary 			Aggiunge un evento al calendario
// @Description 		Aggiunge un evento al calendario dell'utente loggato (nel caso di evento condiviso, aggiunge anche l'evento al calendario degli utenti con cui è condiviso)
// @Param 			    index header string true "Indice dell'utente loggato"
// @Param 			    title header string true "Titolo dell'evento"
// @Param 			    description header string true "Descrizione dell'evento"
// @Param 			    date header string true "Data dell'evento"
// @Param 			    idUser header string true "Id dell'utente che ha creato l'evento"
// @Param 			    notify header string true "Notifica dell'evento"
// @Param 			    type header string true "Shared or Personal"
// @Param 				notifyTime header string true "Tempo di notifica"
// @Param				color header string true "Colore dell'evento"
// @Param				idChats header []string false "Id delle chat con cui è condiviso l'evento (se type è Shared)"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /addCalendarEvent [post]
func AddCalendarEvent(c *gin.Context) {
	var form models.AddCalendarEvent
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.AddCalendarEventDB(index.(string), form, c)
}

// DeleteCalendarEvent	godoc
// @Summary 			Elimina un evento dal calendario
// @Description 		Elimina un evento dal calendario dell'utente loggato (nel caso di evento condiviso, elimina anche l'evento al calendario degli utenti con cui è condiviso)ù
// @Param 			    index header string true "Indice dell'utente loggato"
// @Param 			    idEvent header string true "Id dell'evento da eliminare"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /deleteCalendarEvent [delete]

func DeleteCalendarEvent(c *gin.Context) {
	var form models.DeleteCalendarEvent
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.DeleteCalendarEventDB(index.(string), form, c)
}

// UpdateCalendarEvent	godoc
// @Summary 			Modifica un evento del calendario
// @Description 		Modifica un evento del calendario dell'utente loggato (nel caso di evento condiviso, modifica anche l'evento al calendario degli utenti con cui è condiviso)
// @Param 			    index header string true "Indice dell'utente loggato"
// @Param 			    idEvent header string true "Id dell'evento da modificare"
// @Param 			    title header string false "Titolo dell'evento"
// @Param 			    description header string false "Descrizione dell'evento"
// @Param 			    date header string false "Data dell'evento"
// @Param 			    notify header string false "Notifica dell'evento"
// @Param 			    type header string false "Shared or Personal"
// @Param 				notifyTime header string false "Tempo di notifica"
// @Param				color header string false "Colore dell'evento"
// @Param				idChats header []string false "Id delle chat con cui è condiviso l'evento (se type è Shared)"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /updateCalendarEvent [patch]
func UpdateCalendarEvent(c *gin.Context) {
	var form models.UpdateCalendarEvent
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.UpdateCalendarEventDB(index.(string), form, c)
}
