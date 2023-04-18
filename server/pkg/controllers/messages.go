package controllers

import (
	"github.com/gorilla/websocket"

	"net/http"

    "github.com/gin-gonic/gin"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all connections
		return true
	},
}

func Socket(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        http.NotFound(c.Writer, c.Request)
        return
    }

    for {
        messageType, p, err := conn.ReadMessage()
        if err != nil {
            return
        }
        if err = conn.WriteMessage(messageType, p); err != nil {
            return
        }
    }
}
