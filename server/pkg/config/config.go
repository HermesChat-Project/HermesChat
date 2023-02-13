package config

//load vars from .env file

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

var PORT int; 
var CONNECTION_STRING_MONGODB string;
var SECRET string;

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
}
