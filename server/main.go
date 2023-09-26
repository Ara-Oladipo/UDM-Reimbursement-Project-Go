package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Ara-Oladipo/UDM-Reimbursement-Project-Go/application"
)

func main() {
	app := application.New(":8080")

	fmt.Println("Server Started")
	log.Fatal(http.ListenAndServe(app.Addr, app.Routes))
}
