package controllers

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"chat/pkg/models"
	"chat/pkg/utils"
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

// Logout	godoc
// @Summary 			Logout utente
// @Description 		Effettua il logout di un utente e cancella il cookie http-only
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    401 {object} string
// @Router 		        /logout [post]
func Logout(c *gin.Context) {
	utils.DeleteToken(c)
}

// GetVersion	godoc
// @Summary 			Ottieni versione
// @Description 		Restituisce la versione del server in modo da poterla confrontare con quella del client
// @Produce 		    json
// @Success 		    200 {object} string
// @Router 		        /getVersion [get]
func GetVersion(c *gin.Context) {
	c.JSON(200, gin.H{"version": "1.0.0"})
}

// CheckToken	godoc
// @Summary 			Controlla token
// @Description 		Controlla se il token è valido oppure no, così il client sa se l'utente è loggato o no
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    401 {object} string
// @Router 		        /checkToken [get]
func CheckToken(c *gin.Context) {
	fmt.Println("CheckToken")
	utils.CheckToken(c)
}
// Signup	godoc
// @Summary 			Registrazione di un utente
// @Description 		Effettua la registrazione di un utente e crea un codice OTP che verrà inviato via email
// @Param 			    username formData string true "Username dell'utente"
// @Param 			    password formData string true "Password dell'utente"
// @Param 			    email formData string true "Email dell'utente"
// @Param 			    name formData string true "Nome dell'utente"
// @Param 			    surname formData string true "Cognome dell'utente"
// @Param 			    lang formData string true "Lingua dell'utente"
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
	utils.VerifyPassword(form.Email, form.Username, form.Password, form.Name, form.Surname, form.Lang, c)
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

//SendFile	godoc
// @Summary 			Invia un file
// @Description 		Salva il file nella cartella del server dell'utente loggato e invia il file all'utente specificato
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    username formData string true "Username dell'utente a cui inviare il file"
// @Param 			    file formData file true "File da inviare"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /sendFile [post]
func SendFile (c *gin.Context) {
	err := c.Request.ParseMultipartForm(32 << 20)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	form, _ := c.MultipartForm()
	if form == nil {
		c.JSON(400, gin.H{"error": "Form vuoto"})
		return
	}
	//get chatId from form
	chatId := c.Request.FormValue("chatId")
	if chatId == "" {
		c.JSON(400, gin.H{"error": "No chatId found"})
	}
	
	
	files := form.File["file"]

	
	if len(files) == 0 {
		c.JSON(400, gin.H{"error": "No file found"})
		return
	}
	index, _ := c.Get("index")
	utils.UploadFile(index.(string), chatId, files, c)
	
}

//GetFiles	godoc
// @Summary 			Scarica i file
// @Description 		Scarica i file dagli url specificati e li invia al client
// @Param 			    urls formData []string true "Url dei file da scaricare"
// @Param 			    chatId formData []string true "ChatId delle chat in cui si trovano i file"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /getFiles [post]
func GetFiles (c *gin.Context) {
	//get a json array of urls
	var form models.GetFilesRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(form)
	//get index from token
	index, _ := c.Get("index")
	utils.DownloadFile(index.(string), form.Url, form.ChatId, c)
}


//CreateGroup	godoc
// @Summary 			Crea un gruppo
// @Description 		Crea un gruppo con i membri specificati, almeno uno e attribuisce il ruolo di admin a colui che ha creato il server
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    name formData string true "Nome del gruppo"
// @Param 			    users formData []string true "Membri del gruppo (ci sono gli id)"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /createGroup [post]

func CreateGroup (c *gin.Context) {
	var form models.CreateGroupRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.CreateGroupDB(index.(string), form, c)
}

//AddUserToGroup	godoc
// @Summary 			Aggiungi utente ad un gruppo
// @Description 		Aggiunge un o più utenti ad un gruppo
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    chatId formData string true "Id del gruppo"
// @Param 			    users formData []string true "Id dei membri da aggiungere al gruppo"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /addUserToGroup [post]

func AddUserToGroup(c *gin.Context){
	var form models.AddUserToGroupRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.AddUserToGroupDB(index.(string), form, c)
}

//ChangeRoleGroup	godoc
// @Summary 			Cambia il ruolo di un utente in un gruppo
// @Description 		Cambia il ruolo di un utente in un gruppo se si è admin
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    chatId formData string true "Id del gruppo"
// @Param 			    user formData string true "Id dell'utente a cui cambiare il ruolo"
// @Param 			    role formData string true "Ruolo da assegnare all'utente (admin o normal)"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /changeRoleGroup [post]

func ChangeRoleGroup (c *gin.Context){
	var form models.ChangeRoleGroup;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.ChangeRoleGroupDB(index.(string), form, c)
}

//RemoveUserFromGroup	godoc
// @Summary 			Rimuovi utente da un gruppo
// @Description 		Rimuove un utente da un gruppo passando l'id del gruppo e l'id dell'utente da rimuovere (se si è admin)
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    chatId formData string true "Id del gruppo"
// @Param 			    userId formData string true "Id dell'utente da rimuovere"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /removeUserFromGroup [post]
func RemoveUserFromGroup (c *gin.Context){
	var form models.RemoveUserFromGroupRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.RemoveUserFromGroupDB(index.(string), form, c)
}

//RemoveFriend	godoc
// @Summary 			Rimuovi amico
// @Description 		Rimuove un amico passando l'id dell'utente da rimuovere, tuttavia le chat non vengono eliminate
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    userId formData string true "Id dell'amico da rimuovere"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /removeFriend [post]
func RemoveFriend (c *gin.Context){
	var form models.RemoveFriend;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.RemoveFriendDB(index.(string), form.UserId, c)
}

//LeaveGroup	godoc
// @Summary 			Abbandona gruppo
// @Description 		Abbandona un gruppo passando l'id del gruppo
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    chatId formData string true "Id del gruppo"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    500 {object} string
// @Router 		        /leaveGroup [post]
func LeaveGroup(c *gin.Context){
	var form models.LeaveGroupRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.LeaveGroupDB(index.(string), form.ChatId, c)
}

//DeleteGroup	godoc
// @Summary 			Elimina gruppo
// @Description 		Elimina un gruppo passando l'id del gruppo (se si è admin)
// @Param 			    index formData string true "Indice dell'utente loggato"
// @Param 			    chatId formData string true "Id del gruppo"
// @Produce 		    json
// @Success 		    200 {object} string
// @Failure 		    400 {object} string
// @Failure 		    401 {object} string
// @Failure 		    500 {object} string
// @Router 		        /deleteGroup [post]
func DeleteGroup (c *gin.Context){
	var form models.DeleteGroupRequest;
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	index, _ := c.Get("index")
	utils.DeleteGroupDB(index.(string), form.ChatId, c)
}