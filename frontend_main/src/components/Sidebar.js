import React, { useState } from "react";
import logoImage from "../assets/logo.png";
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiUserPlus,
  FiUser,
  FiLogOut,
} from "react-icons/fi";


function Sidebar({ setPage }) {
  const [activePage, setActivePage] = useState("dashboard");

  const handlePageChange = (page) => {
    setActivePage(page);
    setPage(page);
  };




  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};


  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "abonnements", label: "Abonnements", icon: <FiDatabase /> },
    { id: "create_user", label: "Créer un utilisateur", icon: <FiUserPlus /> },
    { id: "mon_compte", label: "Mon compte", icon: <FiUser /> },
  ];

  return (
    <aside className="w-64 bg-gray-50 text-gray-800 flex flex-col min-h-screen shadow-md border-r border-gray-200">
      {/* Logo Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-200">
        <img
          src={logoImage}
          alt="Logo"
          className="w-20 h-20 mb-3 rounded-full shadow-sm hover:scale-105 transition-transform duration-300"
        />
        <span className="text-lg font-semibold tracking-wide text-gray-700">
          Kapersky Management
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 flex flex-col gap-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
              ${
                activePage === item.id
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 text-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-red-500 transition"
        >
          <FiLogOut />
          <span>Déconnexion</span>
        </button>

        <p className="text-xs text-gray-400 mt-2">
          &copy; 2025 Kapersky
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
