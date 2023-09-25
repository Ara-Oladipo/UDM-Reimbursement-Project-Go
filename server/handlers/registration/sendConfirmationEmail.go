package registration

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
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

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Email Sent!"))

}
