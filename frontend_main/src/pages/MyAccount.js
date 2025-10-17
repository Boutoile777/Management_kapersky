import React, { useState } from "react";
import axios from "axios";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import backgroundImage from "../assets/dec.png"; // image à afficher à gauche

function MyAccount() {
  const [formData, setFormData] = useState({
    email: "",
    old_pin: "",
    new_pin: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  const token = localStorage.getItem("token"); // JWT stocké après login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.put(
        "http://127.0.0.1:5000/auth/update_admin",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Compte mis à jour ✅");
      setFormData({ email: "", old_pin: "", new_pin: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erreur serveur ❌";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Colonne gauche : image */}
        <div
          className="w-1/2 hidden md:block bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <div className="w-full h-full bg-black/20"></div> {/* overlay sombre */}
        </div>

        {/* Colonne droite : formulaire */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-6 text-green-600">
            <FiUser size={26} />
            <h2 className="text-2xl font-semibold ml-2">Mon Compte</h2>
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
              <label className="block font-semibold mb-1 text-gray-700">
                Nouvel Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Laissez vide si inchangé"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <FiLock className="text-gray-500" />
              <span className="font-semibold text-gray-700">Changer le PIN</span>
            </div>

            {/* Ancien PIN avec bouton voir/masquer */}
            <div className="relative">
              <label className="block font-semibold mb-1 text-gray-700">
                Ancien PIN
              </label>
              <input
                type={showOldPin ? "text" : "password"}
                name="old_pin"
                value={formData.old_pin}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOldPin(!showOldPin)}
                className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-500"
              >
                {showOldPin ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Nouveau PIN avec bouton voir/masquer */}
            <div className="relative">
              <label className="block font-semibold mb-1 text-gray-700">
                Nouveau PIN
              </label>
              <input
                type={showNewPin ? "text" : "password"}
                name="new_pin"
                value={formData.new_pin}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-500"
              >
                {showNewPin ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
