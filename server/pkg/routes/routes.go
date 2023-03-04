package routes

import (
	"github.com/gin-gonic/gin"
	//add folder local called controllers
	"chat/pkg/controllers"
	"chat/pkg/utils"
)

func SetupRoutes(router *gin.Engine) {
	router.Use(AuthMiddleware())
	router.POST("/login", controllers.Login)
	router.POST("/signup", controllers.SignUp)
	router.POST("/addFriend", controllers.AddFriend)
	/*
	router.GET("/getUsers", controllers.commondHand.SearchUsers)
	router.POST("/removeFriend", controllers.RemoveFriend)
	router.POST("/acceptFriend", controllers.AcceptFriend)
	router.POST("/declineFriend", controllers.DeclineFriend)
	router.POST("/createGroup", controllers.CreateGroup)
	router.POST("/addUserToGroup", controllers.AddUserToGroup)
	router.POST("/removeUserFromGroup", controllers.RemoveUserFromGroup)
	router.POST("/sendMessage", controllers.SendMessage)
	router.POST("/sendGroupMessage", controllers.SendGroupMessage)
	router.POST("/getMessages", controllers.GetMessages)
	router.POST("/getGroupMessages", controllers.GetGroupMessages)
	router.POST("/getFriends", controllers.GetFriends)
	router.POST("/getFriendRequests", controllers.GetFriendRequests)
	router.POST("/getGroups", controllers.GetGroups)
	router.POST("/getGroupUsers", controllers.GetGroupUsers)
	*/
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		utils.VerifyToken(c);
	}
}

