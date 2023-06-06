package config

//load vars from .env file

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"strconv"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/go-redis/redis"
)

var PORT int; 
var CONNECTION_STRING_MONGODB string;
var SECRET string;
var DOMAIN string;
var PWDGMAIL string;
var ClientMongoDB *mongo.Client;
var Conns = make(map[string]*websocket.Conn);
var ClientRedis *redis.Client;
var API_KEY_GODADDY string;
var API_SECRET_GODADDY string;
var REDIS_ADDR string;
var REDIS_PWD string;

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	PORT, err = strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		log.Fatal("Error converting PORT from .env file")
	}
	CONNECTION_STRING_MONGODB = os.Getenv("connectionString")
	SECRET = os.Getenv("SECRET")
	DOMAIN = os.Getenv("DOMAIN")
	PWDGMAIL = os.Getenv("PWDGMAIL")
	API_KEY_GODADDY = os.Getenv("API_KEY_GODADDY")
	API_SECRET_GODADDY = os.Getenv("API_SECRET_GODADDY")
	REDIS_ADDR = os.Getenv("REDIS_ADDR")
	REDIS_PWD = os.Getenv("REDIS_PWD")
	if (PORT == 0){
		PORT = 80;
	}
}

func ConnectToRedis(){
	ClientRedis = redis.NewClient(&redis.Options{
		Addr:     REDIS_ADDR, // Replace with your Redis host and port
		Password: REDIS_PWD,                               // Replace with your Redis password, if applicable
		DB:       0,                                                               // Redis database index
	})
	
	// Ping the Redis server to check the connection
	_, err := ClientRedis.Ping().Result()
	if err != nil {
		// Handle connection error
		panic(err)
	}	
	ClientRedis.FlushAll()
}
func ConnectToDBMongoDB(){
	//eseguo la connessione al database

	client, err := mongo.NewClient(options.Client().ApplyURI(CONNECTION_STRING_MONGODB))
	if err != nil {
		panic(err)
	}
	err = client.Connect(context.Background())
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	ClientMongoDB = client
}


func GetMyIP() string {
	var ip string
	ifaces, err := net.Interfaces()
	if err != nil {
		panic(err)
	}
	for _, i := range ifaces {
		addrs, err := i.Addrs()
		if err != nil {
			panic(err)
		}
		for _, addr := range addrs {
			var ipnet *net.IPNet
			switch v := addr.(type) {
			case *net.IPNet:
				ipnet = v
			case *net.IPAddr:
				ipnet = &net.IPNet{
					IP: v.IP,
				}
			}
			if ipnet != nil && !ipnet.IP.IsLoopback() {
				if ipnet.IP.To4() != nil {
					ip = ipnet.IP.String()
				}
			}
		}
	}
	return ip
}

func GetUserConnectionsRedis (id string) []string{
	val, err := ClientRedis.LRange(id, 0, -1).Result()
	if err != nil {
		panic(err)
	}
	return val
}