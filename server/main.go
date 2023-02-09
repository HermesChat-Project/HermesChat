package main 

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"chat/pkg/routes"
)

func main() {
	fmt.Println("Starting server...")
	router := gin.Default()
	//set routers
	routes.SetupRoutes(router)
	router.Run(":8080")
}