
package main

import (
    "encoding/json"
    "log"
    "net/http"
)

func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("Vary", "Origin")

        if r.Header.Get("Origin") == "http://localhost:5173" {
            w.Header().Set(
                "Access-Control-Allow-Origin",
                "http://localhost:5173",
            )
            w.Header().Set(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            )
            w.Header().Set(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization",
            )
        }

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }

        w.Header().Set("Content-Type", "application/json")

        json.NewEncoder(w).Encode(map[string]string{
            "status":  "success",
            "message": "Go backend connected!",
        })
    })

    log.Println("Server running at http://localhost:8080")

    log.Fatal(http.ListenAndServe(
        "localhost:8080",
        corsMiddleware(mux),
    ))
}
