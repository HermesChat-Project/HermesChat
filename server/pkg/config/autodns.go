package config

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)




func ConfigDnsAuto() {
	var domain string = "hermeschat.it"  
	var subdomain   = "api"   
	var apiKey      = API_KEY_GODADDY
	var apiSecret   = API_SECRET_GODADDY

	ipAddress, err := getIPAddress()
	if err != nil {
		fmt.Printf("Errore durante il recupero dell'indirizzo IP: %s\n", err.Error())
		return
	}

	url := fmt.Sprintf("https://api.godaddy.com//v1/domains/%s/records/A/%s", domain, subdomain)
	client := &http.Client{}
	req, err := http.NewRequest("PUT", url, strings.NewReader(fmt.Sprintf("[{\"data\":\"%s\",\"ttl\":3600}]", ipAddress)))
	if err != nil {
		fmt.Printf("Errore durante la creazione della richiesta: %s\n", err.Error())
		return
	}
	req.Header.Add("Authorization", fmt.Sprintf("sso-key %s:%s", apiKey, apiSecret))
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Errore durante l'invio della richiesta: %s\n", err.Error())
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Errore durante la lettura della risposta: %s\n", err.Error())
		return
	}
	if resp.StatusCode == http.StatusOK {
		fmt.Println("Record A aggiornato correttamente.")
	} else {
		fmt.Printf("Errore durante l'aggiornamento del record A: %s\n", string(body))
	}
}

// Funzione per ottenere l'indirizzo IP pubblico
func getIPAddress() (string, error) {
	resp, err := http.Get("https://api.ipify.org")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
