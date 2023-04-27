package utils

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"

	"chat/pkg/config"
	"chat/pkg/models"
)

const infoUser = "Hey I'm using HermesChat"

func CreateToken (index string, c *gin.Context) {
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
	c.Header("Authorization", tokenString)
	//c.Header("Set-Cookie", "token="+tokenString+"; Path=/; HttpOnly");
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Expose-Headers", "Authorization")
	c.SetCookie("token", tokenString, 3600, "/", "localhost", false, true)
	c.Header("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))

	c.JSON(http.StatusOK, gin.H{
		"ris": "ok",
	})
}

func VerifyToken (c *gin.Context){
	//print header
	fmt.Println(c.Request.Header)
	cookie := c.Request.Header.Get("Authorization")
	fmt.Println("cookie:" + cookie)
	//check if token is empty
	if (cookie == "") {
		//redirect to login page
		if (c.Request.URL.Path == "/login" || c.Request.URL.Path == "/signup" || c.Request.URL.Path == "/favicon.ico") {
			c.Next()
		}else{
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
	if !ok || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"ris": "Unauthorized",
		})
		c.Abort()
		return
	}
	c.Set("index", claims["sub"])
	c.Next()
}

func LoginMongoDB (username string, password string, c *gin.Context) {
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
	CreateToken(result["_id"].(primitive.ObjectID).Hex(), c)	
}

func VerifyPassword(s string, u string, e string,c *gin.Context){
	//7 or more characters, at least one letter and one number and one special character and one uppercase letter
		var (
			hasMinLen  = false
			hasUpper   = false
			hasLower   = false
			hasNumber  = false
			hasSpecial = false
		)
		if len(s) >= 7 {
			hasMinLen = true
		}
		for _, char := range s {
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
		if hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial{
			checkEmail(e, u, s, c)
		} else {
			err := fmt.Errorf("password not valid")
			SendError(c, err)
		}
}
func checkEmail(email string, username string, password string, c *gin.Context) {
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
	checkUsername(username, password, email, c)
}
func checkUsername (username string, password string, email string, c *gin.Context) {
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
		errConn();
		return
	}
	collection.InsertOne(
		context.Background(), 
		bson.M{
			"nickname": username, 
			"email" : email,
			"password": string(hash),
			"visible": true,
			"info": infoUser,
			"language": "it",
		},
	)
}

func searchUser (username string) bool {
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn();
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

func GetId (u string) string{
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn();
		return ""
	}
	ris := collection.FindOne(context.Background(), bson.M{"nickname": u})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn();
		return ""
	}
	return result["_id"].(primitive.ObjectID).Hex()
}

func UpdateInfoDB(i string, inf string, c *gin.Context){
	collection := config.ClientMongoDB.Database("user").Collection("user")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn();
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
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while updating info",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "info updated",
	})
}

func GetFriendsDB(i string, c *gin.Context){
	idFriendship := getIDS("friendship", i, c);
	collection := config.ClientMongoDB.Database("user").Collection("friendship")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(idFriendship)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}

	//just want a list of friends's nicknames
	type Friend struct {
		Nickname string `json:"nickname"`
		ID string `json:"id"`
		Image string `json:"image"`
		Name string `json:"name"`
	}
	var friends []Friend
	for _, v := range result2["friends"].(primitive.A) {
		friends = append(friends, Friend{
			Nickname: v.(primitive.M)["nickname"].(string),
			ID: v.(primitive.M)["idUser"].(string),
			Name: v.(primitive.M)["name"].(string) + " " + v.(primitive.M)["surname"].(string),
			Image: v.(primitive.M)["image"].(string),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"friends": friends,
	})
}

func GetFriendRequestsDB(i string, c *gin.Context){
	idRequests := getIDS("toAccept", i, c);
	collection := config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(idRequests)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	aus := result2["pending"];
	c.JSON(http.StatusOK, gin.H{
		"requests": aus,
	})
}


func GetBlockedDB(i string, c *gin.Context){
	idBlocked := getIDS("blocked", i, c);

	collection := config.ClientMongoDB.Database("user").Collection("blocked")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(idBlocked)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	ris := collection.FindOne(context.Background(), bson.M{"_id": objID2})
	var result2 bson.M
	ris.Decode(&result2)
	if result2 == nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	aus := result2["blocked"];
	c.JSON(http.StatusOK, gin.H{
		"blocked": aus,
	})
}

func SendFriendRequestDB(i string, username string, c *gin.Context){

	var friend models.Friend;

	collectionFriend := config.ClientMongoDB.Database("user").Collection("user")
	if collectionFriend == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return;
	}
	objID, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return;
	}
	ris := collectionFriend.FindOne(context.Background(), bson.M{"_id": objID})
	var result bson.M
	ris.Decode(&result)
	if result == nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return;
	}

	friend.Nickname = result["nickname"].(string);
	friend.ID = i;
	friend.Image = result["image"].(string);

	idUsr := GetId(username);
	idToAccept := getIDS("toAccept", idUsr, c);
	collection := config.ClientMongoDB.Database("user").Collection("toAcceptFriendship")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(idToAccept)
	if err != nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	
	// update the pending array
	ris2 := collection.FindOneAndUpdate(context.Background(), bson.M{"_id": objID2}, bson.M{"$push": bson.M{"pending": friend}})
	ris2.Decode(&result)
	if result == nil {
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "friend request sent",
	})
}

func BlockUserDB(i string, username string, c *gin.Context){
	var friend models.Friend;

	friend.Nickname = username;
	friend.ID = GetId(username);

	idBlocked := getIDS("blocked", i, c);
	collection := config.ClientMongoDB.Database("user").Collection("blocked")
	if collection == nil {
		errConn();
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error while connecting to database",
		})
		return
	}
	objID2, err := primitive.ObjectIDFromHex(idBlocked)
	if err != nil {
		errConn();
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
		errConn();
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid ObjectID",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "user blocked",
	})
}

func getIDS(res string, i string, c *gin.Context) (string) {
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
}
