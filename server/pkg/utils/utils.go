package utils

import (
	"bytes"
	"context"
	"crypto/tls"
	"fmt"
	"html/template"
	"math/rand"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"

	"chat/pkg/config"
	"chat/pkg/models"
)

const infoUser = "Hey I'm using HermesChat"

func CreateToken(index string, c *gin.Context) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": index,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(config.SECRET))

	if err != nil {
		errr := fmt.Errorf("error while creating token")
		SendError(c, errr)
		go config.WriteFileLog(err)
		return
	}
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Expose-Headers", "Authorization")
	cookie := &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Domain:   "api.hermeschat.it",
		Expires:  time.Now().Add(24 * time.Hour * 30),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}
	http.SetCookie(c.Writer, cookie)
	c.Header("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))

	c.JSON(http.StatusOK, gin.H{
		"ris": "ok",
	})
}

func DeleteToken(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Domain:   "api.hermeschat.it",
		Expires:  time.Now().AddDate(0, 0, -1), // Set expiration to a past time
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	}

	http.SetCookie(c.Writer, cookie)

	c.JSON(http.StatusOK, gin.H{
		"ris": "ok",
	})
}

func CheckToken(c *gin.Context) {
	cookie, err := c.Cookie("token")
	if cookie == "" || err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"ris": "no token",
		})
		c.Abort()
		return
	}
}

func VerifyToken(c *gin.Context) {
	cookie, err := c.Cookie("token")

	//print header
	//check if token is empty or null
	if cookie == "" || err != nil {
		//redirect to login page
		if c.Request.URL.Path == "/login" || c.Request.URL.Path == "/signup" || c.Request.URL.Path == "/favicon.ico" || c.Request.URL.Path == "/checkOtp" || strings.HasPrefix(c.Request.URL.Path, "/docs") || c.Request.URL.Path == "/getVersion" || c.Request.URL.Path == "/checkToken" {
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"ris": "Unauthorized",
			})
			c.Abort()
		}
		return
	}

	//check if token is valid
	token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.SECRET), nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"ris": "Unauthorized",
		})
		c.Abort()
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid || claims["exp"] == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"ris": "Unauthorized",
		})
		c.Abort()
		return
	}
	c.Set("index", claims["sub"])
	c.Next()
}

func LoginMongoDB(username string, password string, c *gin.Context) {
	if config.ClientMongoDB == nil {
		errr := fmt.Errorf("error while connecting to database")
		SendError(c, errr)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errr := fmt.Errorf("error while connecting to database")
		SendError(c, errr)
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errr := fmt.Errorf("username not found")
		SendError(c, errr)
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(result["password"].(string)), []byte(password))
	if err != nil {
		errr := fmt.Errorf("wrong password")
		SendError(c, errr)
		return
	}

	if result["flagOtp"] == false {
		c.JSON(http.StatusUnauthorized, gin.H{
			"ris": "check otp",
		})
	}
	CreateToken(result["_id"].(primitive.ObjectID).Hex(), c)
}

func VerifyPassword(email string, user string, pwd string, name string, surname string, lang string, c *gin.Context) {
	//7 or more characters, at least one letter and one number and one special character and one uppercase letter
	var (
		hasMinLen  = false
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)
	if len(pwd) >= 7 {
		hasMinLen = true
	}
	for _, char := range pwd {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}
	if hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial {
		checkEmail(email, user, pwd, name, surname, lang, c)
	} else {
		err := fmt.Errorf("password not valid")
		SendError(c, err)
	}
}
func checkEmail(email string, username string, password string, name string, surname string, lang string, c *gin.Context) {
	//check that email is an email
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		err := fmt.Errorf("email not valid")
		SendError(c, err)
		return
	}
	if config.ClientMongoDB == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"email": email})
	var result bson.M
	ris.Decode(&result)
	if result != nil {
		err := fmt.Errorf("email already exists")
		SendError(c, err)
		return
	}
	checkUsername(username, password, email, lang, name, surname, c)
}
func checkUsername(username string, password string, email string, lang string, name string, surname string, c *gin.Context) {
	if len(username) < 3 || len(username) > 20 {
		err := fmt.Errorf("username not found")
		SendError(c, err)
		return
	}
	if config.ClientMongoDB == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		return
	}
	found := searchUser(username)
	if found {
		err := fmt.Errorf("username already exists")
		SendError(c, err)
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		err := fmt.Errorf("error while generating hash")
		SendError(c, err)
		go config.WriteFileLog(err)
		return
	}
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		err := fmt.Errorf("error while connecting to database")
		SendError(c, err)
		errConn()
		return
	}

	//generate OTP and send email
	otp := generateOTP()

	go sendEmail(email, otp)
	//add a field ids which is an array of string, that in the 0 contains a json called "chats" which contains an array of string

	collection.InsertOne(
		context.Background(),
		bson.M{
			"nickname":  username,
			"name":      name,
			"surname":   surname,
			"email":     email,
			"password":  string(hash),
			"visible":   true,
			"info":      infoUser,
			"language":  lang,
			"otp":       otp,
			"flagOtp":   false,
			"otpExpire": time.Now().Add(time.Minute * 10),
			"ids": []struct {
				Chat []string `bson:"chats"`
			}{
				{
					Chat: []string{},
				},
			},
		},
	)
	//print the id of the user created

	id := GetId(username)

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	fmt.Println("obj:" + objID.Hex())
	//create a collection with the id of the user
	collection = config.ClientMongoDB.Database("user").Collection("blocked")
	_, err1 := collection.InsertOne(
		context.Background(),
		bson.M{
			"_id":     objID,
			"blocked": []string{},
		},
	)
	if err1 != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error while creating collection",
		})
		return
	}
	collection = config.ClientMongoDB.Database("user").Collection("friendship")
	//insert id and friends which is an array of object
	_, err2 := collection.InsertOne(
		context.Background(),
		bson.M{
			"_id":     objID,
			"friends": []string{},
		},
	)
	if err2 != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error while creating collection",
		})
		return
	}
	collection = config.ClientMongoDB.Database("user").Collection("sentFriendship")
	_, err3 := collection.InsertOne(
		context.Background(),
		bson.M{
			"_id":    objID,
			"sentTo": []string{},
		},
	)
	if err3 != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error while creating collection",
		})
		return
	}
	collection = config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	_, err4 := collection.InsertOne(
		context.Background(),
		bson.M{
			"_id":     objID,
			"pending": []string{},
		},
	)
	if err4 != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error while creating collection",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"ris": "user created",
	})
}

func generateOTP() string {
	//generate random 6 digit number and letters
	var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 6)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func sendEmail(dest string, otp string) {
	from := "g.marello.1757@vallauri.edu"
	pwd := config.PWDGMAIL

	m := gomail.NewMessage()

	// Set E-Mail sender
	m.SetHeader("From", from)

	// Set E-Mail receivers
	m.SetHeader("To", dest)

	// Set E-Mail subject
	m.SetHeader("Subject", "OTP codice per la registrazione")

	// Set E-Mail body. You can set plain text or html with text/html
	//take template from file and replace the otp
	tmplt, err := template.ParseFiles("templates/email.html")
	if err != nil {
		fmt.Println(err)
	}
	var doc bytes.Buffer
	data := struct {
		Otp string
	}{
		Otp: otp,
	}
	tmplt.Execute(&doc, data)
	m.SetBody("text/html", doc.String())

	// Settings for SMTP server
	d := gomail.NewDialer("smtp.gmail.com", 587, from, pwd)

	// This is only needed when SSL/TLS certificate is not valid on server.
	// In production this should be set to false.
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// Now send E-Mail
	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
		panic(err)
	}

	fmt.Println("Email Inviata Correttamente!")
}
func searchUser(username string) bool {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn()
		return true
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": username})
	var result bson.M
	ris.Decode(&result)
	return result != nil
}

func errConn() {
	err := fmt.Errorf("error while connecting to database")
	go config.WriteFileLog(err)
}

func SendError(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"message": err.Error(),
	})
}

func GetId(u string) string {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn()
		return ""
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": u})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn()
		return ""
	}
	return result["_id"].(primitive.ObjectID).Hex()
}

func UpdateInfoDB(i string, inf string, c *gin.Context) {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	_, err = collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objID},
		bson.M{"$set": bson.M{"info": inf}},
	)
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while updating info",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "info updated",
	})

	collFriendship := config.ClientMongoDB.Database("user").Collection("friendship")
	if collFriendship == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	res := collFriendship.FindOne(context.Background(), bson.M{"id": objID})
	var result bson.M
	res.Decode(&result)

	//for each friend of the user, send socket message
	for _, friend := range result["friends"].([]interface{}) {

		//get idUser which is a field of the friend
		idUser := friend.(primitive.M)["idUser"].(string)
		type Message struct {
			Type     string `json:"type"`
			Username string `json:"username"`
			Info     string `json:"info"`
		}

		msg := Message{Type: "CUI", Username: i, Info: inf}
		fmt.Println(msg)
		connsId := config.GetUserConnectionsRedis(idUser)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != nil {
				connDest.WriteJSON(msg)
			}
		}
	}
}

func GetFriendsDB(i string, c *gin.Context) {
	collection := config.ClientMongoDB.Database("user").Collection("friendship")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	//just want a list of friends's nicknames
	type Friend struct {
		Nickname string `json:"nickname"`
		ID       string `json:"id"`
		Image    string `json:"image"`
		Name     string `json:"name"`
		Surname  string `json:"surname"`
	}
	var friends []Friend
	for _, v := range result2["friends"].(primitive.A) {
		friends = append(friends, Friend{
			Nickname: v.(primitive.M)["nickname"].(string),
			ID:       v.(primitive.M)["idUser"].(string),
			Name:     v.(primitive.M)["name"].(string),
			Surname:  v.(primitive.M)["surname"].(string),
			Image:    v.(primitive.M)["image"].(string),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"friends": friends,
	})
}

func GetFriendRequestsDB(i string, c *gin.Context) {
	collection := config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	aus := result2["pending"]
	c.JSON(http.StatusOK, gin.H{
		"requests": aus,
	})
}

func GetRequestSentDB(i string, c *gin.Context) {
	collection := config.ClientMongoDB.Database("user").Collection("sentFriendship")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID 1",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID 2",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"requests": result2["sentTo"],
	})
}

func GetBlockedDB(i string, c *gin.Context) {

	collection := config.ClientMongoDB.Database("user").Collection("blocked")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	aus := result2["blocked"]
	c.JSON(http.StatusOK, gin.H{
		"blocked": aus,
	})
}

func SendFriendRequestDB(i string, username string, c *gin.Context) bool {

	//check if there is already a friendship

	collection3 := config.ClientMongoDB.Database("user").Collection("friendship")
	if collection3 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return false
	}
	fmt.Println(username)
	objCheck, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		return false
	}
	risCheck := collection3.FindOne(context.Background(), bson.M{"_id": objCheck, "friends.idUser": username})
	var resultCheck bson.M
	risCheck.Decode(&resultCheck)
	if resultCheck != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "already friends",
		})
		return false
	}

	var friend models.Friend

	collectionFriend := config.ClientMongoDB.Database("user").Collection("user")
	if collectionFriend == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return false
	}
	objID, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj1",
		})

		return false
	}
	ris := collectionFriend.FindOne(context.Background(), bson.M{"_id": objID})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj2",
		})
		return false
	}

	friend.Nickname = result["nickname"].(string)
	friend.IDUser = i
	friend.Image = result["image"].(string)
	friend.Name = result["name"].(string)
	friend.Surname = result["surname"].(string)
	id := GetId(username)
	objID2, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj3",
		})

		return false
	}
	var friend2 models.Friend
	ris2 := collectionFriend.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris2.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj4",
		})
		return false
	}
	friend2.Nickname = result2["nickname"].(string)
	friend2.IDUser = id
	friend2.Image = result2["image"].(string)
	friend2.Name = result2["name"].(string)
	friend2.Surname = result2["surname"].(string)
	//add to sentFriendship
	collection2 := config.ClientMongoDB.Database("user").Collection("sentFriendship")
	if collection2 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return false
	}
	objID3, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj5",
		})

		return false
	}
	ris3 := collection2.FindOneAndUpdate(context.Background(), bson.M{"_id": objID3}, bson.M{"$push": bson.M{"sentTo": friend2}})
	var result3 bson.M
	ris3.Decode(&result3)
	if result3 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj6",
		})

		return false
	}
	collection := config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return false
	}
	// update the pending array
	ris4 := collection.FindOneAndUpdate(context.Background(), bson.M{"_id": objID2}, bson.M{"$push": bson.M{"pending": friend}})
	ris4.Decode(&result)
	if result == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid obj4",
		})

		return false
	}

	//send to the username socket conn

	type Message struct {
		Type     string        `json:"type"`
		Username string        `json:"username"`
		Friend   models.Friend `json:"friend"`
	}
	msg := Message{Type: "FRR", Username: friend.Nickname, Friend: friend}
	fmt.Println(msg)
	connsId := config.GetUserConnectionsRedis(id)
	for _, connId := range connsId {
		connDest := config.Conns[connId]
		if connDest != nil {
			connDest.WriteJSON(msg)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "friend request sent",
	})
	return true

}

func BlockUserDB(i string, username string, c *gin.Context) {
	var friend models.Friend

	friend.Nickname = username
	friend.IDUser = GetId(username)

	collection := config.ClientMongoDB.Database("user").Collection("blocked")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	//findOneAndUpdate with push to add the blocked user
	ris2 := collection.FindOneAndUpdate(context.Background(), bson.M{"_id": objID2}, bson.M{"$push": bson.M{"blocked": friend}})
	var result2 bson.M
	ris2.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "user blocked",
	})
}

/* func getIDS(res string, i string, c *gin.Context) (string) {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return "";
	}
	objID, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return "";
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return "";
	}

	id := result["ids"];
	id = id.(primitive.A)[0];

	return id.(primitive.M)[res].(string);
} */

func AcceptFriendRequestDB(index string, form models.AcceptFriendRequest, c *gin.Context) {

	//add to friends array
	collectionFriendship := config.ClientMongoDB.Database("user").Collection("friendship")
	if collectionFriendship == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID3, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID-1",
		})
		return
	}

	type Friend struct {
		Nickname string `json:"nickname" bson:"nickname"`
		ID       string `json:"idUser" bson:"idUser"`
		Image    string `json:"image" bson:"image"`
		Name     string `json:"name" bson:"name"`
		Surname  string `json:"surname" bson:"surname"`
	}

	var friend Friend
	friend.Nickname = form.Nickname
	friend.ID = form.IdFriend
	friend.Image = form.Image
	friend.Name = form.Name
	friend.Surname = form.Surname

	ris3 := collectionFriendship.FindOneAndUpdate(context.Background(), bson.M{"_id": objID3}, bson.M{"$push": bson.M{"friends": friend}})
	var result3 bson.M
	ris3.Decode(&result3)
	if result3 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID0",
		})
		return
	}

	//add to friend's friends array
	collectionFriendship2 := config.ClientMongoDB.Database("user").Collection("friendship")
	if collectionFriendship2 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID4, err := primitive.ObjectIDFromHex(form.IdFriend)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID1",
		})
		return
	}

	var friend2 Friend

	collection5 := config.ClientMongoDB.Database("user").Collection("user")
	if collection5 == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID5, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID2",
		})
		return
	}
	ris5 := collection5.FindOne(context.Background(), bson.M{"_id": objID5})
	var result5 bson.M
	ris5.Decode(&result5)
	if result5 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID3",
		})
		return
	}

	friend2.Nickname = result5["nickname"].(string)
	friend2.ID = index
	friend2.Image = result5["image"].(string)
	friend2.Name = result5["name"].(string)
	friend2.Surname = result5["surname"].(string)

	ris4 := collectionFriendship2.FindOneAndUpdate(context.Background(), bson.M{"_id": objID4}, bson.M{"$push": bson.M{"friends": friend2}})
	var result4 bson.M
	ris4.Decode(&result4)
	if result4 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID4",
		})
		return
	}

	//remove from sent array
	collectionSentTo := config.ClientMongoDB.Database("user").Collection("sentFriendship")
	if collectionSentTo == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	fmt.Println("paolo id:" + form.IdFriend)
	objID6, err := primitive.ObjectIDFromHex(form.IdFriend)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID5",
		})
		return
	}
	ris6 := collectionSentTo.FindOneAndUpdate(context.Background(), bson.M{"_id": objID6}, bson.M{"$pull": bson.M{"sentTo": bson.M{"idUser": index}}})
	var result6 bson.M
	ris6.Decode(&result6)
	if result6 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID6",
		})
		return
	}

	collection := config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID7",
		})
		return
	}
	ris2 := collection.FindOneAndUpdate(context.Background(), bson.M{"_id": objID2}, bson.M{"$pull": bson.M{"pending": bson.M{"idUser": form.IdFriend}}})
	var result2 bson.M
	ris2.Decode(&result2)
	if result2 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID8",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "friendship accepted",
	})

	//socket

	type Message struct {
		Type     string `json:"type"`
		Username string `json:"username"`
		Friend   Friend `json:"friend"`
	}

	msg := Message{Type: "FRA", Username: friend2.Nickname, Friend: friend2}
	fmt.Println(msg)
	connsId := config.GetUserConnectionsRedis(friend.ID)
	for _, connId := range connsId {
		connDest := config.Conns[connId]
		if connDest != nil {
			connDest.WriteJSON(msg)
		}
	}
}

func DeclineFriendRequestDB(index string, idUser string, c *gin.Context) {
	//if someone sent a friend request to me, I have to remove it from my sentTo array and from his pending array
	collectionSentTo := config.ClientMongoDB.Database("user").Collection("sentFriendship")
	if collectionSentTo == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID, err := primitive.ObjectIDFromHex(idUser)
	if err != nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID9",
		})
		return
	}
	ris := collectionSentTo.FindOneAndUpdate(context.Background(), bson.M{"_id": objID}, bson.M{"$pull": bson.M{"sentTo": bson.M{"idUser": index}}})
	var result bson.M
	ris.Decode(&result)
	fmt.Println("result: ", result)

	objID2, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID10",
		})
		return
	}
	collectionPending := config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	if collectionPending == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	ris2 := collectionPending.FindOneAndUpdate(context.Background(), bson.M{"_id": objID2}, bson.M{"$pull": bson.M{"pending": bson.M{"idUser": idUser}}})
	var result2 bson.M
	ris2.Decode(&result2)
	fmt.Println("result2: ", result2)

	c.JSON(http.StatusOK, gin.H{
		"message": "friend request declined",
	})

	type Message struct {
		Type     string `json:"type"`
		Username string `json:"idUser"`
	}
	msg := Message{Type: "FRD", Username: index}
	fmt.Println(msg)
	connsId := config.GetUserConnectionsRedis(idUser)
	for _, connId := range connsId {
		connDest := config.Conns[connId]
		if connDest != nil {
			connDest.WriteJSON(msg)
		}
	}

}

func GetInfoDB(index string, c *gin.Context) {
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
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	opts := options.FindOne().SetProjection(bson.M{"password": 0, "ids": 0})
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID}, opts)
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	c.JSON(http.StatusOK, result)

}

func CheckOtpDB(form models.CheckOtp, c *gin.Context) {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	ris1 := collection.FindOne(context.Background(), bson.M{"nickname": form.Nickname})
	var result1 bson.M
	ris1.Decode(&result1)
	if result1 == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid email",
		})
		return
	}
	objID, err := primitive.ObjectIDFromHex(result1["_id"].(primitive.ObjectID).Hex())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn()
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	//check if otp is expired (24 hours)
	otpDate := result["otpExpire"].(primitive.DateTime)
	otpDateGo := otpDate.Time()
	now := time.Now()
	diff := now.Sub(otpDateGo)
	if diff.Hours() > 24 {
		//delete
		collection.FindOneAndDelete(context.Background(), bson.M{"_id": objID})
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "otp expired",
		})
		return
	}
	if result["otp"] == form.Otp {
		collection.FindOneAndUpdate(context.Background(), bson.M{"_id": objID}, bson.M{"$set": bson.M{"otp": "", "otpDate": "", "flagOtp": true}})
		c.JSON(http.StatusOK, gin.H{
			"message": "otp correct",
		})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "otp incorrect",
		})
	}
}

func GetInfoUsr(index string) (models.Info, string) {

	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		return models.Info{}, "error while connecting to database"
	}
	objID, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		return models.Info{}, "invalid ObjectID"
	}
	opts := options.FindOne().SetProjection(bson.M{"_id": 1, "name": 1, "surname": 1, "image": 1, "nickname": 1})
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID}, opts)
	var result models.Info
	ris.Decode(&result)

	if result == (models.Info{}) {
		return models.Info{}, "invalid ObjectID"
	}
	return result, ""
}

func SearchUsersDB(username string, c *gin.Context) {
	//check legth of username
	if len(username) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "username too short",
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
	//take 100 users that start with username

	pipeline := []bson.M{
		{"$match": bson.M{"nickname": primitive.Regex{Pattern: "^" + username, Options: "i"}}},
		{"$limit": 100},
		{"$project": bson.M{"_id": 1, "nickname": 1, "image": 1}},
	}

	cursor, err := collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	var result []bson.M
	cursor.All(context.Background(), &result)
	c.JSON(http.StatusOK, result)
}

func RemoveFriendDB(index string, idFriend string, c *gin.Context) {
	objId, err := primitive.ObjectIDFromHex(index)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	objIdFriend, err := primitive.ObjectIDFromHex(idFriend)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	//remove the friend from both users
	collection := config.ClientMongoDB.Database("user").Collection("friendship")
	if collection == nil {
		errConn()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//remove friend from user 1
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objId}, bson.M{"$pull": bson.M{"friends": idFriend}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	//remove friend from user 2
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objIdFriend}, bson.M{"$pull": bson.M{"friends": index}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}

	type Message struct {
		Type string `json:"type"`
		Payload string `json:"payload"`
	}
	msg := Message{
		Type: "RFR",
		Payload: index,
	}

	connsId := config.GetUserConnectionsRedis(idFriend)
	for _, connId := range connsId {
		connDest := config.Conns[connId]
		if connDest != nil {
			connDest.WriteJSON(msg)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"ris": "friend removed",
	})

}
