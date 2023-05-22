package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
)
	

// Update Info godoc
// @Summary 			Aggiorna informazioni utente
// @Description 		Aggiorna lo "stato" dell'utente loggato
// @Param 			    newInfo header string true "Nuove informazioni da aggiornare"
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /updateInfo [patch]
func UpdateInfo (c *gin.Context) {	
	var form models.UpdateInfo;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.UpdateInfoDB(index.(string), form.NewInfo, c)

}

// Search users	godoc
// @Summary 			Ricerca utenti
// @Description 		Cerca fino a 100 utenti con username che inizia con la stringa passata come parametro
// @Param 			    username header string true "Caratteri con cui inizia l'username"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /search [get]
func SearchUsers (c *gin.Context) {
	var usr = c.Query("username")
	utils.SearchUsersDB(usr, c)
}

// GetFriends	godoc
// @Summary 			Ricerca amici utente
// @Description 		Restituisce tutti gli amici dell'utente loggato
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getFriends [post]
func GetFriends (c *gin.Context) {
	index, _ := c.Get("index")
	utils.GetFriendsDB(index.(string), c)
}

// GetFriendRequest	godoc
// @Summary 			Ricerca richieste di amicizia utente
// @Description 		Restituisce tutti le richieste di amicizia dell'utente loggato
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getFriendRequests [post]
func GetFriendRequests (c *gin.Context) {
	index, _ := c.Get("index")
	utils.GetFriendRequestsDB(index.(string), c)
}
// GetBlocked	godoc
// @Summary 			Ricerca utenti bloccati
// @Description 		Restituisce tutti gli utenti bloccati dall'utente loggato
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getBlocked [post]
func GetBlocked(c *gin.Context) {
	index, _ := c.Get("index")
	utils.GetBlockedDB(index.(string), c)
}

// BlockUser	godoc
// @Summary 			Blocca utente
// @Description 		Blocca l'utente passato come parametro dall'utente loggato
// @Param 			    index header string true "Indice dell'utente loggato"
// @Param 			    username header string true "Username dell'utente da bloccare"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /blockUser [post]
func BlockUser (c *gin.Context) {
	var form models.BlockUser;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.BlockUserDB(index.(string), form.Username, c)
}


// GetRequestSent	godoc
// @Summary 			Ricerca richieste di amicizia inviate
// @Description 		Restituisce tutti le richieste di amicizia inviate dell'utente loggato
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getRequestSent [post]
func GetRequestSent (c *gin.Context) {
	index, _ := c.Get("index")
	utils.GetRequestSentDB(index.(string), c)
}


// AcceptFriendRequest	godoc
// @Summary 			Accetta richiesta di amicizia
// @Description 		Accetta la richiesta di amicizia dell'utente loggato con l'utente passato come parametro
// @Param 			    index header string true "Indice dell'utente loggato"
// @Param 			    idUser header string true "Indice dell'utente da accettare"
// @Param 			    nickname header string true "Nickname dell'utente da accettare"
// @Param 			    name header string true "Nome dell'utente da accettare"
// @Param 			    surname header string true "Cognome dell'utente da accettare"
// @Param 			    image header string true "Immagine dell'utente da accettare"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /acceptFriend [post]
func AcceptFriendRequest (c *gin.Context) {
	var form models.AcceptFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.AcceptFriendRequestDB(index.(string), form, c)
}
// DeclineFriendRequest	godoc
// @Summary 			Rifiuta richiesta di amicizia
// @Description 		Rifiuta la richiesta di amicizia dell'utente loggato con l'utente passato come parametro
// @Param 			    index header string true "Indice dell'utente loggato"
// @Param 			    idUser header string true "Indice dell'utente da rifiutare"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /declineFriend [post]
func DeclineFriendRequest (c *gin.Context) {
	var form models.RefuseFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.DeclineFriendRequestDB(index.(string), form.IdFriend, c)
}

// Get Info	godoc
// @Summary 			Informazioni utente
// @Description 		Restituisce le informazioni dell'utente loggato
// @Param 			    index header string true "Indice dell'utente loggato"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getInfoUser [post]
func GetInfo (c *gin.Context) {
	index, _ := c.Get("index")
	utils.GetInfoDB(index.(string), c)
}

// Check OTP	godoc
// @Summary 			Verifica OTP
// @Description 		Verifica che l'OTP inserito dall'utente sia lo stesso generato dal server e inviato via email
// @Param 			    id header string true "Indice dell'utente da verificare"
// @Param 			    otp header string true "OTP inserito dall'utente"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /checkOtp [post]
func CheckOtp (c *gin.Context) {
	var form models.CheckOtp;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	utils.CheckOtpDB(form, c)
}