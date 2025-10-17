import React, { useState } from "react";

function AjouterAbonnement({ onAdd }) {
  const [form, setForm] = useState({
    nom_prenoms: "",
    direction: "",
    poste: "",
    date_expiration: "",
    code_abonnement: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ nom_prenoms: "", direction: "", poste: "", date_expiration: "", code_abonnement: "" });
  };

  return (
    <form className="bg-white p-6 shadow rounded space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="nom_prenoms"
        placeholder="Nom et Prénoms"
        value={form.nom_prenoms}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="direction"
        placeholder="Direction"
        value={form.direction}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="poste"
        placeholder="Poste"
        value={form.poste}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="date_expiration"
        value={form.date_expiration}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="code_abonnement"
        placeholder="Code Abonnement"
        value={form.code_abonnement}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Ajouter
      </button>
    </form>
  );
}

export default AjouterAbonnement;
