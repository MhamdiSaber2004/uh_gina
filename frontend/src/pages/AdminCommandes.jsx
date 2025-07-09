import { useEffect, useState } from "react";
import AdminSingleCommandes from "../components/AdminSingleCommande";
import {getAllCommandes} from "../axios/commandeApi";
import AdminAddCommandeModalContent from "../components/AdminAddCommandeModalContent";


export default function AdminCommandes() {
  const [filterEtat, setFilterEtat] = useState("all");
  const [allCommandes, setallCommandes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAllCommandes()
      .then((res) => {setallCommandes(res.data.commandes); })
      .catch((err) => { console.error(err); });
  });
  const filteredCommandes = filterEtat === "all"
    ? allCommandes
    : allCommandes.filter(c => c.etat === filterEtat);

  return (
    <div className="flex flex-col items-center p-4">
      {/* Add Commande Button */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Commande
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Commande</h2>
            
            {/* Your form or content goes here */}
            <AdminAddCommandeModalContent />
            
            <br />
            {/* Close button */}
            <div className="text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
          <AdminSingleCommandes key={commande._id} commande={commande} />
        ))}
      </div>
    </div>
  );
}