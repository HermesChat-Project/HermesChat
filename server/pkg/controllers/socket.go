package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

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

var Conns = make(map[string]*websocket.Conn)

func SocketConnection(c *gin.Context) {

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	index, _ := c.Get("index")
	fmt.Println("index:", index)
	Conns[index.(string)] = conn

	go func() {
		for {
			var request models.Request
			err = conn.ReadJSON(&request)
			if err != nil {
				fmt.Println("error:", err)
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					delete(Conns, index.(string))
					fmt.Println("connection closed")
				}
				return
			}

			fmt.Println("request:", request)
			Conns[index.(string)] = conn
			request.Index = index.(string)
			go handleTypes(request, conn)
		}
	}()

}

func handleTypes(request models.Request, conn *websocket.Conn) {
	switch request.Type {
	case "MSG":
		handleMessage(request, conn)
	case "FRE":
		handleFriendRequest(request, conn)
	}
}

func handleMessage(request models.Request, conn *websocket.Conn) {
	var users []string = utils.GetUsersFromGroup(request.IdDest)
	for _, user := range users {
		connDest := Conns[user]
		if connDest != conn {
			write(connDest, request)
		}
	}
	go utils.SaveMessage(request)
}
func handleFriendRequest(request models.Request, conn *websocket.Conn) {
	var utente = request.IdDest
	if utils.SendFriendRequestDB(request.Index, utente, conn){
		connDest := Conns[utente]
		if connDest != conn {
			write(connDest, request)
		}
	}else{
		conn.WriteJSON("error")
	}
}

func write(conn *websocket.Conn, request models.Request) {
	if conn != nil {
		conn.WriteJSON(request)
	}
}
