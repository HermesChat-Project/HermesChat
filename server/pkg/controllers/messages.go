package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"net/http"
	"log"
	"fmt"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all connections
		return true
	},
}

func Socket (c *gin.Context) {
     
	fmt.Println("Socket Entrato")
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)

        if err != nil {
            log.Print("upgrade:", err)
            c.Abort()
            return
        }
         for {

            msgType, msg, err := conn.ReadMessage()
            if err != nil {
                return
            }

            fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))
			

            if err = conn.WriteMessage(msgType, msg); err != nil {
                return
            }
        }

}