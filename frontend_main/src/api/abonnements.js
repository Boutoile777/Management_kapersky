const API_URL = "http://127.0.0.1:5000/abonnements"; // ton backend Flask

export async function fetchAbonnements() {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Impossible de récupérer les abonnements");
  return await res.json();
}

export async function addAbonnement(abonnement) {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(abonnement),
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout de l'abonnement");
  return await res.json();
}

export async function updateAbonnement(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification");
  return await res.json();
}

export async function deleteAbonnement(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return await res.json();
}
