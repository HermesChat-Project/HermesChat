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
// @version 1.0.1
// @description Server API e Websocket per il progetto HermesChat. Il server è stato sviluppato in Go con il framework Gin e utilizza MongoDB come database.
// @host api.hermeschat.it
// @BasePath /

func main() {
	config.LoadConfig()
	fmt.Println("Starting server...")
	router := gin.Default()
	config.ConnectToRedis()
	fmt.Println("redis db: ", config.ClientRedis.DBSize().Val())
	config.ConnectToDBMongoDB()
	//set routers
	routes.SetupRoutes(router)
	//get my ip
	router.RunTLS("0.0.0.0:" + strconv.Itoa(config.PORT), "fullchain.pem", "privkey.pem")
}

