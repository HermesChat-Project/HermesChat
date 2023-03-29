package main

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"

	"chat/pkg/config"
	"chat/pkg/routes"
)


func main() {
	config.LoadConfig()
	fmt.Println("Starting server...")
	router := gin.Default()
	config.ConnectToDBMongoDB()
	//set routers
	routes.SetupRoutes(router)
	//get my ip
	ip := config.GetMyIP()
	router.RunTLS(ip + ":" + strconv.Itoa(config.PORT), "cert.crt", "key.pem")
	router.Static("/static", "./static")
}

