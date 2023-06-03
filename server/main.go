package main

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"

	"chat/pkg/config"
	"chat/pkg/routes"
	_ "chat/docs"
)

// @title HermesChat API 
// @version 1.0
// @description Server API e Websocket per il progetto HermesChat. Il server è stato sviluppato in Go con il framework Gin e utilizza MongoDB come database.
// @host api.hermeschat.it:8090
// @BasePath /

func main() {
	config.LoadConfig()
	//config.ConfigDnsAuto()
	fmt.Println("Starting server...")
	router := gin.Default()
	config.ConnectToRedis()
	fmt.Println("redis db: ", config.ClientRedis.DBSize().Val())
	config.ConnectToDBMongoDB()
	//set routers
	routes.SetupRoutes(router)
	//get my ip
	ip := config.GetMyIP()
	router.RunTLS(ip + ":" + strconv.Itoa(config.PORT), "fullchain.pem", "privkey.pem")
}

