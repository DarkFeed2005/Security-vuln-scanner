package main

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"sync"
	"time"
)

type PortScanResult struct {
	Port    int    `json:"port"`
	Status  string `json:"status"`
	Service string `json:"service"`
}

type ScanRequest struct {
	Host  string `json:"host"`
	Ports []int  `json:"ports"`
}

type ScanResponse struct {
	Host    string           `json:"host"`
	Results []PortScanResult `json:"results"`
	Total   int              `json:"total_scanned"`
	Open    int              `json:"open_ports"`
}

func scanPort(host string, port int, timeout time.Duration) PortScanResult {
	target := fmt.Sprintf("%s:%d", host, port)
	conn, err := net.DialTimeout("tcp", target, timeout)

	if err != nil {
		return PortScanResult{
			Port:    port,
			Status:  "closed",
			Service: "",
		}
	}

	conn.Close()
	return PortScanResult{
		Port:    port,
		Status:  "open",
		Service: getService(port),
	}
}

func getService(port int) string {
	services := map[int]string{
		20:    "FTP-Data",
		21:    "FTP",
		22:    "SSH",
		23:    "Telnet",
		25:    "SMTP",
		53:    "DNS",
		80:    "HTTP",
		110:   "POP3",
		143:   "IMAP",
		443:   "HTTPS",
		445:   "SMB",
		3306:  "MySQL",
		3389:  "RDP",
		5432:  "PostgreSQL",
		5900:  "VNC",
		8080:  "HTTP-Proxy",
		8443:  "HTTPS-Alt",
		27017: "MongoDB",
	}

	if service, ok := services[port]; ok {
		return service
	}
	return "Unknown"
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func handleScan(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ScanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Host == "" {
		http.Error(w, "Host is required", http.StatusBadRequest)
		return
	}

	// If no ports specified, scan common ports
	if len(req.Ports) == 0 {
		req.Ports = []int{21, 22, 23, 25, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080}
	}

	fmt.Printf("Starting scan for host: %s, ports: %v\n", req.Host, req.Ports)

	var wg sync.WaitGroup
	resultsChan := make(chan PortScanResult, len(req.Ports))

	// Scan ports concurrently
	for _, port := range req.Ports {
		wg.Add(1)
		go func(p int) {
			defer wg.Done()
			result := scanPort(req.Host, p, 2*time.Second)
			resultsChan <- result
		}(port)
	}

	// Wait for all scans to complete
	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	// Collect results
	var allResults []PortScanResult
	openCount := 0

	for result := range resultsChan {
		allResults = append(allResults, result)
		if result.Status == "open" {
			openCount++
		}
	}

	response := ScanResponse{
		Host:    req.Host,
		Results: allResults,
		Total:   len(req.Ports),
		Open:    openCount,
	}

	fmt.Printf("Scan completed. Total: %d, Open: %d\n", response.Total, response.Open)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"service": "port-scanner",
	})
}

func main() {
	http.HandleFunc("/scan", handleScan)
	http.HandleFunc("/health", handleHealth)

	fmt.Println("🚀 Port Scanner Service starting...")
	fmt.Println("🌐 Server running on http://localhost:8081")
	fmt.Println("📡 Endpoints:")
	fmt.Println("   - POST /scan")
	fmt.Println("   - GET  /health")

	if err := http.ListenAndServe(":8081", nil); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}
