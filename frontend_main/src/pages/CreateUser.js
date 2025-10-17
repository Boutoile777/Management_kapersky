import React, { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import axios from "axios";
import backgroundImage from "../assets/eza.png"; // ton image

function CreateUser() {
  const [formData, setFormData] = useState({ email: "", pin: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/auth/create_admin",
        formData
      );
      setMessage(res.data.message || "Utilisateur créé avec succès ✅");
      setFormData({ email: "", pin: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erreur serveur ❌";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>

      {/* Formulaire */}
      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-gray-200 z-10">
        <div className="flex items-center justify-center mb-6 text-black">
          <FiUserPlus size={28} />
          <h2 className="text-2xl font-semibold ml-2">Créer un utilisateur</h2>
        </div>

        {message && (
          <div className="mb-4 text-center text-sm font-semibold px-4 py-2 rounded-lg bg-green-50 text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Adresse Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Code PIN
            </label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
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
            {loading ? "Création..." : "Créer l’utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
