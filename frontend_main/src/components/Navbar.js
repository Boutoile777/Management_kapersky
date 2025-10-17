import React from "react";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";

function Navbar() {
  // Récupère l'email depuis localStorage (mis à jour après login)
  const email = localStorage.getItem("managerEmail") || "Administrateur";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("managerEmail"); // supprime aussi l'email
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button className="text-gray-600 hover:text-gray-900 lg:hidden">
          <FiMenu size={22} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
          Kapersky Management
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Profil utilisateur */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
            <FiUser size={20} className="text-gray-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-800  font-semibold">{email}</span>
            <span className="text-gray-500 text-sm">Manager</span>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          <FiLogOut size={16} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
