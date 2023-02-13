package main 

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"

	"chat/pkg/routes"
	"chat/pkg/config"

)

func main() {
	config.LoadConfig()
	fmt.Println("Starting server...")
	router := gin.Default()
	//set routers
	routes.SetupRoutes(router)
	router.Run(":" + strconv.Itoa(config.PORT))
}