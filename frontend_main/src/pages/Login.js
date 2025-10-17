// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import backgroundImage from "../assets/1one.png"; // arrière-plan gauche

function Login() {
  const [formData, setFormData] = useState({ email: "", pin: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/login", formData);

      const token = res.data.token;
      const email = res.data.email; // <-- récupération de l'email
      localStorage.setItem("token", token); // stocke le token
      localStorage.setItem("managerEmail", email); // <-- stocke l'email pour Navbar

      setMessage("Connexion réussie ✅");
      setFormData({ email: "", pin: "" });

      setTimeout(() => {
        window.location.href = "/dashboard"; // redirection vers le dashboard
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erreur serveur ❌";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Colonne gauche : image */}
        <div
          className="w-1/2 hidden md:block bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="w-full h-full bg-black/40"></div>
        </div>

        {/* Colonne droite : formulaire */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-6 text-green-600">
            <FiUser size={26} />
            <h2 className="text-2xl font-semibold ml-2">Connexion</h2>
          </div>

          {message && (
            <div
              className={`mb-4 text-center text-sm font-semibold px-4 py-2 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Adresse Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <label className="block font-semibold mb-1 text-gray-700">Code PIN</label>
              <input
                type={showPin ? "text" : "password"}
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-500"
              >
                {showPin ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
