package controllers

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
)
	


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
// @Router 		        /searchUsers [get]
func SearchUsers (c *gin.Context) {
	//get parameters from get request
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
	//get a value added with c.Set
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
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetFriendRequestsDB(index.(string), c)
}

func GetBlocked(c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetBlockedDB(index.(string), c)
}

func BlockUser (c *gin.Context) {
	var form models.BlockUser;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.BlockUserDB(index.(string), form.Username, c)
}

func GetRequestSent (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetRequestSentDB(index.(string), c)
}

func AcceptFriendRequest (c *gin.Context) {
	var form models.AcceptFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.AcceptFriendRequestDB(index.(string), form, c)
}
func DeclineFriendRequest (c *gin.Context) {
	var form models.RefuseFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")

	utils.DeclineFriendRequestDB(index.(string), form.IdFriend, c)
}

func GetInfo (c *gin.Context) {
	//get a value added with c.Set
	index, _ := c.Get("index")
	utils.GetInfoDB(index.(string), c)
}

func CheckOtp (c *gin.Context) {
	var form models.CheckOtp;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	utils.CheckOtpDB(form, c)
}