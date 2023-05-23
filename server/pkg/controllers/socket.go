package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"chat/pkg/config"
	"chat/pkg/models"
	"chat/pkg/utils"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Connect to socket	godoc
// @Summary 			Connessione al socket
// @Description 		Permette di connettersi al socket realizzato con libreria Gorilla Websocket
// @Param 			    index header string true "Indice dell'utente"
// @Produce 		    json
// @Success 		    200
// @Router 		        /socket [get]
func SocketConnection(c *gin.Context) {

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	index, _ := c.Get("index")
	uuid := uuid.New().String()
	config.Conns[uuid] = conn
	errRedis := config.ClientRedis.LPush(index.(string), uuid).Err()
	if errRedis != nil {
		fmt.Println("error:", errRedis)
	}

	conn.WriteJSON("connected")

	go func() {

		for {
			var request models.Request
			err = conn.ReadJSON(&request)
			if err != nil {
					fmt.Println("closing connection")
					config.ClientRedis.LRem(index.(string), 0, uuid)
					conn.Close()
				return
			}
			request.Index = index.(string)
			go handleTypes(request, conn)
		}
	}()

}

func handleTypes(request models.Request, conn *websocket.Conn) {
	switch request.Type {
	case "MSG":
		handleMessage(request, conn)
	}
}

func handleMessage(request models.Request, conn *websocket.Conn) {
	var users []string = utils.GetUsersFromGroup(request.IdDest)
	for _, user := range users {
		connsId := config.GetUserConnectionsRedis(user)
		for _, connId := range connsId {
			connDest := config.Conns[connId]
			if connDest != conn && connDest != nil{
				connDest.WriteJSON(request)
			}
		}
	}
	go utils.SaveMessage(request)
}
