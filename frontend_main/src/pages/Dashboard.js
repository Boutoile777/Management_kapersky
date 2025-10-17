import React, { useEffect, useState } from "react";
import CardStat from "../components/CardStat";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [stats, setStats] = useState({
    actifs: 0,
    bientotExp: 0,
    expires: 0
  });

  useEffect(() => {
    fetch("http://localhost:5000/abonnements/dashboard_stats")
      .then(res => res.json())
      .then(data => {
        setStats({
          actifs: data.actifs,
          bientotExp: data.bientot_expire,
          expires: data.expirés
        });
      })
      .catch(err => console.error("Erreur API :", err));
  }, []);

  const chartData = {
    labels: ["Actifs", "Bientôt expirés", "Expirés"],
    datasets: [
      {
        data: [stats.actifs, stats.bientotExp, stats.expires],
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"],
        hoverOffset: 15
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Dashboard Abonnements</h1>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 w-full max-w-6xl">
        <CardStat
          title="Abonnements Actifs"
          value={stats.actifs}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
        />
        <CardStat
          title="Bientôt expirés (<30j)"
          value={stats.bientotExp}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
        />
        <CardStat
          title="Abonnements Expirés"
          value={stats.expires}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
        />
      </div>

      {/* Graphique Doughnut */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Répartition des abonnements</h2>
        <div className="w-80 h-80">
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
