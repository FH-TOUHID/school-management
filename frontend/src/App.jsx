
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((data) => {
        setStatus(data.message);
      })
      .catch(() => {
        setStatus("Backend connection failed!");
      });
  }, []);

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-card p-8 shadow-sm border border-line">

        <div className="w-14 h-14 rounded-xl bg-brand flex items-center justify-center mb-6">
          <span className="text-dark font-bold text-2xl">S</span>
        </div>

        <h1 className="text-3xl font-bold text-dark">
          School Management System
        </h1>

        <p className="text-muted mt-3">
          React + Vite + Golang + JSON Storage
        </p>

        <div className="mt-8 rounded-xl bg-soft-green p-4">
          <p className="text-sm font-medium text-dark">
            Backend Connection Status
          </p>

          <p className="mt-2 font-semibold text-dark">
            {status}
          </p>
        </div>

        <button className="mt-6 bg-dark text-white py-3 px-6 rounded-lg font-medium hover:bg-brand hover:text-dark transition-colors">
          Project Setup Complete
        </button>

      </div>
    </div>
  );
}

export default App;
