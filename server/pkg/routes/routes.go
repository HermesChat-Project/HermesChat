package routes

import (
	"github.com/gin-gonic/gin"
	//add folder local called controllers
	"chat/pkg/controllers"
	"chat/pkg/utils"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRoutes(router *gin.Engine) {
	router.Use(CORSMiddleware())
	router.Use(AuthMiddleware())

	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.GET("/socket", controllers.SocketConnection) //swagger added
	router.GET("/search", controllers.SearchUsers) //swagger added

	router.POST("/login", controllers.Login) //swagger added
	router.POST("/signup", controllers.SignUp) //swagger added
	router.POST("/checkOtp", controllers.CheckOtp) //swagger added
	router.POST("/getInfoUser", controllers.GetInfo) //swagger added

	router.PATCH("/updateInfo", controllers.UpdateInfo) //swagger added
	router.POST("/getFriends", controllers.GetFriends) //swagger added
	router.POST("/getFriendRequests", controllers.GetFriendRequests) //swagger added
	router.POST("/getRequestSent", controllers.GetRequestSent) //swagger added
	router.POST("/getBlocked", controllers.GetBlocked) //swagger added
	router.POST("/sendFriendRequest", controllers.SendFriendRequest) //swagger added
	router.POST("/acceptFriend", controllers.AcceptFriendRequest) //swagger added
	router.POST("/declineFriend", controllers.DeclineFriendRequest) //swagger added
	router.POST("/blockUser", controllers.BlockUser) //swagger added

	router.POST("/getCalendarEvents", controllers.GetCalendarEvents);
	router.POST("/addCalendarEvent", controllers.AddCalendarEvent);
	router.DELETE("/deleteCalendarEvent", controllers.DeleteCalendarEvent);
	router.PATCH("/updateCalendarEvent", controllers.UpdateCalendarEvent);
	
	router.POST("/createChat", controllers.CreateChat)
	router.POST("/getChats", controllers.GetChats)

	router.POST("/getMessages", controllers.GetMessages)
	/*
	router.POST("/removeFriend", controllers.RemoveFriend)
	router.POST("/createGroup", controllers.CreateGroup)
	router.POST("/addUserToGroup", controllers.AddUserToGroup)
	router.POST("/removeUserFromGroup", controllers.RemoveUserFromGroup)
	*/
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		utils.VerifyToken(c);
	}
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        //setta l'origin con quello che arriva dalla richiesta
		c.Writer.Header().Set("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers",
            "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, Set-Cookie, Cookie") // Allow all headers
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH") // Allow all these methods
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Set-Cookie, Cookie, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
