import React, { useState, useEffect } from "react";
import {
  fetchAbonnements,
  addAbonnement,
  deleteAbonnement,
  updateAbonnement,
} from "../api/abonnements";
import abonnementImage from "./dece.jpg";

function AjouterAbonnement() {
  const [formData, setFormData] = useState({
    nom_prenoms: "",
    direction: "",
    poste: "",
    date_expiration: "",
    code_abonnement: "",
  });
  const [message, setMessage] = useState("");
  const [abonnements, setAbonnements] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 🔍 Recherche
  const [searchTerm, setSearchTerm] = useState("");

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const abonnementsPerPage = 10;

  // --- Charger les abonnements ---
  useEffect(() => {
    loadAbonnements();
  }, []);

  const loadAbonnements = async () => {
    try {
      const data = await fetchAbonnements();
      setAbonnements(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAbonnement(editingId, formData);
        setMessage("Abonnement modifié avec succès ✅");
        setEditingId(null);
      } else {
        await addAbonnement(formData);
        setMessage("Abonnement ajouté avec succès ✅");
      }
      setFormData({
        nom_prenoms: "",
        direction: "",
        poste: "",
        date_expiration: "",
        code_abonnement: "",
      });
      loadAbonnements();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (abonnement) => {
    setFormData({
      nom_prenoms: abonnement.nom_prenoms,
      direction: abonnement.direction,
      poste: abonnement.poste,
      date_expiration: abonnement.date_expiration,
      code_abonnement: abonnement.code_abonnement,
    });
    setEditingId(abonnement.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet abonnement ?"))
      return;
    try {
      await deleteAbonnement(id);
      setMessage("Abonnement supprimé ✅");
      setAbonnements(abonnements.filter((a) => a.id !== id));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // --- 🔍 Filtrage par recherche ---
  const filteredAbonnements = abonnements.filter((ab) =>
    ab.nom_prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ab.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ab.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ab.code_abonnement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 📄 Pagination ---
  const indexOfLastAbonnement = currentPage * abonnementsPerPage;
  const indexOfFirstAbonnement = indexOfLastAbonnement - abonnementsPerPage;
  const currentAbonnements = filteredAbonnements.slice(
    indexOfFirstAbonnement,
    indexOfLastAbonnement
  );

  const totalPages = Math.ceil(filteredAbonnements.length / abonnementsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 bg-gray-200">
      {/* --- SESSION 1 : Liste des abonnements --- */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-gray-800 tracking-wide">
            📋 Liste des Abonnements
          </h3>

          {/* 🔍 Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher un abonnement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="w-full table-auto border-collapse text-sm md:text-base">
            <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Nom & Prénoms</th>
                <th className="p-3 text-left font-semibold">Direction</th>
                <th className="p-3 text-left font-semibold">Poste</th>
                <th className="p-3 text-left font-semibold">Expiration</th>
                <th className="p-3 text-left font-semibold">Code</th>
                <th className="p-3 text-left font-semibold">Constat</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAbonnements.map((ab, idx) => {
                let badgeColor = "bg-green-100 text-green-800";
                if (ab.constat === "Bientôt Expiré")
                  badgeColor = "bg-yellow-100 text-yellow-800";
                else if (ab.constat === "Besoin d'abonnement")
                  badgeColor = "bg-red-100 text-red-800";

                return (
                  <tr
                    key={ab.id}
                    className={`transition duration-300 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50`}
                  >
                    <td className="p-3 text-gray-700">{ab.nom_prenoms}</td>
                    <td className="p-3 text-gray-700">{ab.direction}</td>
                    <td className="p-3 text-gray-700">{ab.poste}</td>
                    <td className="p-3 text-gray-700">{ab.date_expiration}</td>
                    <td className="p-3 text-gray-700">{ab.code_abonnement}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}
                      >
                        {ab.constat}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(ab)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
                      >
                        <i className="fas fa-edit"></i>
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDelete(ab.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
                      >
                        <i className="fas fa-trash"></i>
                        <span>Supprimer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- 📄 Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === num
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* --- SESSION 2 : Formulaire + image --- */}
      <section className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <img
            src={abonnementImage}
            alt="Abonnement"
            className="rounded-lg"
            style={{ width: "120%", height: "80%" }}
          />
        </div>

        {/* Formulaire */}
        <div className="md:w-1/2 p-6">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
            {editingId ? "Modifier un Abonnement" : "Ajouter un Abonnement"}
          </h3>

          {message && (
            <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded text-center font-semibold animate-pulse">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {["nom_prenoms", "direction", "poste", "date_expiration", "code_abonnement"].map(
              (field, i) => (
                <div key={i}>
                  <label className="block font-semibold mb-1">
                    {field === "nom_prenoms"
                      ? "Nom & Prénoms"
                      : field === "direction"
                      ? "Direction"
                      : field === "poste"
                      ? "Poste"
                      : field === "date_expiration"
                      ? "Date d'Expiration"
                      : "Code Abonnement"}
                  </label>
                  <input
                    type={field === "date_expiration" ? "date" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
              )
            )}

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition"
            >
              {editingId ? "Modifier" : "Ajouter"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AjouterAbonnement;
