import { useState, useEffect } from "react";
import SingleCommand from "../components/ClientSingleCommand";
import { getClientCommandes } from "../axios/commandeApi";

export default function ClientAllCommandes() {
  const [allCommandes, setAllCommandes] = useState([]);
  const [filterEtat, setFilterEtat] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientCommandes()
      .then((data) => {
        const commandes = data?.data?.commandes;
        if (Array.isArray(commandes)) {
          setAllCommandes(commandes);
        } else {
          setAllCommandes([]);
          console.error("Commandes is not an array:", commandes);
        }
      })
      .catch((err) => {
        console.error("Error fetching commandes:", err);
        setAllCommandes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading commandes...</p>;

  const filteredCommandes = filterEtat === "all"
    ? allCommandes
    : allCommandes.filter(c => c.etat === filterEtat);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 space-x-2">
        {["all", "encours", "enlivraison", "livree" , "annulee"].map((etat) => (
          <button
            key={etat}
            onClick={() => setFilterEtat(etat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              filterEtat === etat
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {etat}
          </button>
        ))}
      </div>

      <div className="w-full flex flex-col items-center">
        {filteredCommandes.length === 0 ? (
          <p>No commandes found.</p>
        ) : (
          filteredCommandes.map((commande, index) => (
            <SingleCommand key={index} commande={commande} />
          ))
        )}
      </div>
    </div>
  );
}
