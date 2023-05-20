package controllers 

import (
	"github.com/gin-gonic/gin"

	"chat/pkg/utils"
	"chat/pkg/models"
)

// Login	godoc
// @Summary 			Login utente
// @Description 		Effettua il login di un utente e crea un token JWT salvato in un cookie http-only
// @Param 			    username formData string true "Username dell'utente"
// @Param 			    password formData string true "Password dell'utente"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /login [post]
func Login(c *gin.Context) {
	var form models.LoginRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	utils.LoginMongoDB(form.Username, form.Password, c)

}

// Signup	godoc
// @Summary 			Registrazione di un utente
// @Description 		Effettua la registrazione di un utente e crea un codice OTP che verrà inviato via email
// @Param 			    username formData string true "Username dell'utente"
// @Param 			    password formData string true "Password dell'utente"
// @Param 			    email formData string true "Email dell'utente"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /signup [post]
func SignUp (c *gin.Context) {
	var form models.SignUpRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	//check if password respect requirements
	utils.VerifyPassword(form.Email, form.Username, form.Password, c)
}


// SendFriendRequest	godoc
// @Summary 			Invia richiesta di amicizia
// @Description 		Invia una richiesta di amicizia all'utente specificato dall'utente loggato
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    username formData string true "Username dell'utente a cui inviare la richiesta di amicizia"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /sendFriendRequest [post]
func SendFriendRequest (c *gin.Context) {
	var form models.SendFriendRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}	
	index, _ := c.Get("index")

	utils.SendFriendRequestDB(index.(string), form.Username, c)
	
}
