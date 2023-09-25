package registration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

type UserData struct {
	FirstName        string `json:"firstName" validate:"required,min=2,max=50"`
	LastName         string `json:"lastName" validate:"required,min=2,max=50"`
	PhoneNumber      int64  `json:"phoneNumber" validate:"required,number"`
	WorkEmail        string `json:"workEmail" validate:"required,alphanum"`
	EmploymentNumber int64  `json:"employmentNumber" validate:"required,number"`
	Department       string `json:"department" validate:"required"`
}

func SendConfirmationEmail(w http.ResponseWriter, r *http.Request) {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error reading environment variables")
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// Read data from request
	var userData UserData

	if err := json.NewDecoder(r.Body).Decode(&userData); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	//Validate struct
	validate := validator.New(validator.WithRequiredStructEnabled())
	err := validate.Struct(userData)

	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	// Create and send a new message
	m := gomail.NewMessage()
	m.SetHeader("From", "UDM Reimbursement Team <ara@araoladipo.dev>")
	m.SetHeader("To", "oladipea@udmercy.edu")
	m.SetHeader("Subject", "Verify your UDM Email")

	mailTemplate := `
		<div style="background: white">
			<h2 style="font-weight: 500">Verify your Account</h2>
			<h4 style="font-weight: 300">Thanks for signing up for the University of Detroit Mercy Reimbursement System!</h4>
			<h4 style="font-weight: 300">You can verify your account with this link</h4>
			<a href="https://araoladipo.dev"><button style="font-weight: 300; color: white; text-decoration: none; background: #a5093e; padding: 7px 20px">Here</button></a>
			</div>
	`
	// Set the email body
	m.SetBody("text/html", mailTemplate)

	// Create a new SMTP client
	d := gomail.NewDialer(os.Getenv("SENDGRID_URL"), 587, os.Getenv("SENDGRID_USERNAME"), os.Getenv("SENDGRID_PASSWORD"))

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Email Sent!"))

}
