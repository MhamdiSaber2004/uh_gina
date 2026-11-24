import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SingleCommand from "../components/ClientSingleCommand";
import { getClientCommandes } from "../axios/commandeApi";
import { PlusIcon } from "@heroicons/react/24/outline";

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
        }
      })
      .catch((err) => {
        console.error("Error fetching commandes:", err);
        setAllCommandes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const encoursCount = allCommandes.filter(c => c.etat === 'encours').length;
  const enlivraisonCount = allCommandes.filter(c => c.etat === 'enlivraison' || c.etat === 'en livraison').length;
  const livreeCount = allCommandes.filter(c => c.etat === 'livree').length;
  const annuleeCount = allCommandes.filter(c => c.etat === 'annulee').length;

  const filteredCommandes = filterEtat === "all"
    ? allCommandes
    : allCommandes.filter(c => {
        if (filterEtat === 'enlivraison') return c.etat === 'enlivraison' || c.etat === 'en livraison';
        return c.etat === filterEtat;
      });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Header with Quick Add Button */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Link
            to="/client/command"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>طلب جديد</span>
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-extrabold text-gray-900">طلباتي</h1>
            <p className="text-xs text-gray-500 mt-0.5">تتبع حالة كل مشترياتك وطلباتك</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {[
            { id: "all", label: `الكل (${allCommandes.length})` },
            { id: "encours", label: `قيد الانتظار (${encoursCount})` },
            { id: "enlivraison", label: `في الطريق (${enlivraisonCount})` },
            { id: "livree", label: `تمت (${livreeCount})` },
            { id: "annulee", label: `ملغاة (${annuleeCount})` },
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
            <div className="py-12 text-center text-gray-400">جاري تحميل طلباتك...</div>
          ) : filteredCommandes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 w-full space-y-3">
              <span className="text-4xl">🛒</span>
              <p className="text-gray-700 font-bold text-sm">لا توجد طلبات في هذا القسم حالياً</p>
              <p className="text-xs text-gray-500">تحب تطلب وجبة، دواء، أو قضية الدار؟ اطلب توا ونوصلولك!</p>
              <Link
                to="/client/command"
                className="inline-block mt-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow hover:bg-indigo-700 transition"
              >
                إنشاء طلب الآن
              </Link>
            </div>
          ) : (
            filteredCommandes.map((commande, index) => (
              <SingleCommand key={commande._id || index} commande={commande} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
