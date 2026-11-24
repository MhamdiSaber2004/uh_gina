import { useEffect, useState, useCallback } from "react";
import LivreurSingleCommandes from "../components/LivreurSingleComande";
import { getLivreurCommandes } from "../axios/commandeApi";
import { TruckIcon } from "@heroicons/react/24/outline";

export default function LivreurAllCommandes() {
  const [filterEtat, setFilterEtat] = useState("all");
  const [allCommandes, setAllCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommandes = useCallback(() => {
    getLivreurCommandes()
      .then((res) => {
        if (Array.isArray(res?.data?.commandes)) {
          setAllCommandes(res.data.commandes);
        }
      })
      .catch((err) => { console.error(err); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCommandes();
  }, [fetchCommandes]);

  const encoursCount = allCommandes.filter(c => c.etat === 'encours').length;
  const enlivraisonCount = allCommandes.filter(c => c.etat === 'enlivraison' || c.etat === 'en livraison').length;
  const livreeCount = allCommandes.filter(c => c.etat === 'livree').length;

  const filteredCommandes = filterEtat === "all"
    ? allCommandes
    : allCommandes.filter(c => {
        if (filterEtat === 'enlivraison') return c.etat === 'enlivraison' || c.etat === 'en livraison';
        return c.etat === filterEtat;
      });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TruckIcon className="w-6 h-6" />
          </div>
          <div className="text-right">
            <h1 className="text-xl font-extrabold text-gray-900">طلبات التوصيل المتاحة</h1>
            <p className="text-xs text-gray-500 mt-0.5">استلم الطلبات ووجّه طريقك للزبون مباشرة</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {[
            { id: "all", label: `الكل (${allCommandes.length})` },
            { id: "encours", label: `متاحة للاستلام (${encoursCount})` },
            { id: "enlivraison", label: `معك في الطريق (${enlivraisonCount})` },
            { id: "livree", label: `أوصلتها (${livreeCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterEtat(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterEtat === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Commandes List */}
        <div className="w-full flex flex-col items-center">
          {loading ? (
            <div className="py-12 text-center text-gray-400">جاري تحميل الطلبات...</div>
          ) : filteredCommandes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 w-full space-y-2">
              <span className="text-4xl">🛵</span>
              <p className="text-gray-700 font-bold text-sm">لا توجد طلبات في هذا القسم حالياً</p>
              <p className="text-xs text-gray-500">سيتم إدراج أي طلب جديد فور تسجيله من الزبائن.</p>
            </div>
          ) : (
            filteredCommandes.map((commande) => (        
              <LivreurSingleCommandes key={commande._id} commande={commande} onUpdate={fetchCommandes} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
