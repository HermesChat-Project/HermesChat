package config

//load vars from .env file

import (
	"github.com/joho/godotenv"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"strconv"
	"time"

)

var PORT int; 
var CONNECTION_STRING_MONGODB string;
var SECRET string;
var ClientMongoDB *mongo.Client

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
	go CreateFileLog()
}

func ConnectToDBMongoDB(){
	//eseguo la connessione al database

	client, err := mongo.NewClient(options.Client().ApplyURI(CONNECTION_STRING_MONGODB))
	if err != nil {
		WriteFileLog(err)
		panic(err)
	}
	err = client.Connect(context.Background())
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	ClientMongoDB = client
}

func CreateFileLog() {
	if _, err := os.Stat("log.txt"); os.IsNotExist(err) {
		file, err := os.Create("log.txt")
		if err != nil {
			panic(err)
		}
		defer file.Close()
	}
}
func WriteFileLog(errF error) {
	file, err := os.OpenFile("log.txt", os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	//write time and error
	file.WriteString(time.Now().Format("2006-01-02 15:04:05") + " " + errF.Error() + "\n")
}

