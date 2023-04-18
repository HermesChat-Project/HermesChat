package routes

import (
	"github.com/gin-gonic/gin"
	//add folder local called controllers
	"chat/pkg/controllers"
	"chat/pkg/utils"
)

func SetupRoutes(router *gin.Engine) {
	router.Use(AuthMiddleware())
	router.Use(CORSMiddleware())

	router.GET("/socket", controllers.Socket)
	router.POST("/login", controllers.Login)
	router.POST("/signup", controllers.SignUp)
	router.PATCH("/updateInfo", controllers.UpdateInfo)
	router.POST("/getFriends", controllers.GetFriends)
	router.POST("/getFriendRequests", controllers.GetFriendRequests)
	router.POST("/getBlocked", controllers.GetBlocked)
	router.POST("/sendFriendRequest", controllers.SendFriendRequest)
	router.POST("/blockUser", controllers.BlockUser)
	/*
	router.POST("/acceptFriend", controllers.AcceptFriend)
	router.GET("/getUsers", controllers.SearchUsers)
	router.POST("/removeFriend", controllers.RemoveFriend)
	router.POST("/declineFriend", controllers.DeclineFriend)
	router.POST("/createGroup", controllers.CreateGroup)
	router.POST("/addUserToGroup", controllers.AddUserToGroup)
	router.POST("/removeUserFromGroup", controllers.RemoveUserFromGroup)
	router.POST("/sendMessage", controllers.SendMessage)
	router.POST("/sendGroupMessage", controllers.SendGroupMessage)
	router.POST("/getMessages", controllers.GetMessages)
	router.POST("/getGroupMessages", controllers.GetGroupMessages)
	router.POST("/getGroups", controllers.GetGroups)
	router.POST("/getGroupUsers", controllers.GetGroupUsers)
	*/
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		utils.VerifyToken(c);
	}
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers",
            "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, Set-Cookie, Cookie") // Allow all headers
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH") // Allow all these methods

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
