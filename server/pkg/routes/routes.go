package routes

import (
	"github.com/gin-gonic/gin"
	"chat/pkg/controllers"
	"chat/pkg/utils"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRoutes(router *gin.Engine) {
	router.Use(CORSMiddleware())
	router.Use(AuthMiddleware())

	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.GET("/socket", controllers.SocketConnection) 
	router.GET("/search", controllers.SearchUsers) 
	router.GET("/getVersion", controllers.GetVersion)

	router.POST("/login", controllers.Login) 
	router.POST("/logout", controllers.Logout)
	router.GET("/checkToken", controllers.CheckToken)
	router.POST("/signup", controllers.SignUp) 
	router.POST("/checkOtp", controllers.CheckOtp) 
	router.POST("/getInfoUser", controllers.GetInfo) 

	router.PATCH("/updateInfo", controllers.UpdateInfo) 
	router.POST("/getFriends", controllers.GetFriends) 
	router.POST("/getFriendRequests", controllers.GetFriendRequests) 
	router.POST("/getRequestSent", controllers.GetRequestSent) 
	router.POST("/getBlocked", controllers.GetBlocked) 
	router.POST("/sendFriendRequest", controllers.SendFriendRequest) 
	router.POST("/acceptFriend", controllers.AcceptFriendRequest) 
	router.POST("/declineFriend", controllers.DeclineFriendRequest) 
	router.POST("/blockUser", controllers.BlockUser) 
	router.POST("/removeFriend", controllers.RemoveFriend)

	router.POST("/getCalendarEvents", controllers.GetCalendarEvents); 
	router.POST("/addCalendarEvent", controllers.AddCalendarEvent); 
	router.DELETE("/deleteCalendarEvent", controllers.DeleteCalendarEvent); 
	router.PATCH("/updateCalendarEvent", controllers.UpdateCalendarEvent); 
	
	router.POST("/createChat", controllers.CreateChat) 
	router.POST("/getChats", controllers.GetChats) 

	router.POST("/getMessages", controllers.GetMessages) 

	router.POST("/sendFile", controllers.SendFile) 
	router.POST("/getFiles", controllers.GetFiles)

	router.POST("/createGroup", controllers.CreateGroup)
	router.POST("/addUserToGroup", controllers.AddUserToGroup)
	router.POST("/changeRole", controllers.ChangeRoleGroup)
	router.POST("/removeUserFromGroup", controllers.RemoveUserFromGroup)
	router.POST("/leaveGroup", controllers.LeaveGroup)
	router.DELETE("/deleteGroup", controllers.DeleteGroup)
	router.POST("/changeGroupInfo", controllers.ChangeGroupInfo)
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
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE") // Allow all these methods
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Set-Cookie, Cookie, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
