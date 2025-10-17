// src/App.js
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Abonnements from "./pages/Abonnements";
import MyAccount from "./pages/MyAccount";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";

function App() {
  const [page, setPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie la présence du token au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Si non authentifié, afficher uniquement la page Login
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setPage={setPage} />
      <div className="flex-1 flex flex-col">
        <Navbar username="Manager" onLogout={handleLogout} />
        <div className="p-6 flex-1 overflow-auto">
          {page === "dashboard" && <Dashboard />}
          {page === "abonnements" && <Abonnements />}
          {page === "create_user" && <CreateUser />}
          {page === "mon_compte" && <MyAccount />}
        </div>
      </div>
    </div>
  );
}

export default App;
