import { useEffect, useState } from "react";
import LivreurSingleCommandes from "../components/LivreurSingleComande";
import {getLivreurCommandes} from "../axios/commandeApi";


export default function LivreurAllCommandes() {
  const [filterEtat, setFilterEtat] = useState("all");
  const [allCommandes, setallCommandes] = useState([]);

  useEffect(() => {
    getLivreurCommandes()
      .then((res) => {setallCommandes(res.data.commandes); })
      .catch((err) => { console.error(err); });
  });
  const filteredCommandes = filterEtat === "all"
    ? allCommandes
    : allCommandes.filter(c => c.etat === filterEtat);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 space-x-2">
        <button >
          Add Commande
        </button>
      </div>
      {/* Filter Buttons */}
      <div className="mb-4 space-x-2">
        {["all", "encours", "enlivraison" , "livree" , "annulee"].map((etat) => (
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

      {/* Commandes */}
      <div className="w-full flex flex-col items-center">
        {filteredCommandes.map((commande) => (        
          <LivreurSingleCommandes key={commande._id} commande={commande} />
        ))}
      </div>
    </div>
  );
}