package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var (
	clients   = make([]*websocket.Conn, 0)
	clientMux sync.Mutex
)

type DrawCommand struct {
	PrevX int `json:"prevX"`
	PrevY int `json:"prevY"`
	X     int `json:"x"`
	Y     int `json:"y"`
}

func addClient(conn *websocket.Conn) {
	clientMux.Lock()
	defer clientMux.Unlock()
	clients = append(clients, conn)
}

func removeClient(conn *websocket.Conn) {
	clientMux.Lock()
	defer clientMux.Unlock()
	for i, c := range clients {
		if c == conn {
			clients = append(clients[:i], clients[i+1:]...)
			break
		}
	}
}

func broadcastMessage(message []byte) {
	clientMux.Lock()
	defer clientMux.Unlock()
	for _, client := range clients {
		if err := client.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println("Error broadcasting message:", err)
		}
	}
}

func HandleWebsocket(c echo.Context) error {
	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	addClient(conn)
	log.Println("Client Connected")
	defer func() {
		removeClient(conn)
		conn.Close()
		log.Println("Client Disconnected")
	}()

	return Reader(conn)
}

func Reader(conn *websocket.Conn) error {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			return err
		}

		var cmd DrawCommand
		if err := json.Unmarshal(p, &cmd); err != nil {
			log.Println("Error unmarshalling message:", err)
			continue
		}

		if messageType == websocket.TextMessage {
			broadcastMessage(p)
		}
	}
}
