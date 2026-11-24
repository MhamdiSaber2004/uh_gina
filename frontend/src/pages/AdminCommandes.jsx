import { useEffect, useState, useCallback } from "react";
import AdminSingleCommandes from "../components/AdminSingleCommande";
import { getAllCommandes } from "../axios/commandeApi";
import AdminAddCommandeModalContent from "../components/AdminAddCommandeModalContent";
import { 
  PlusIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ArchiveBoxIcon 
} from '@heroicons/react/24/outline';

export default function AdminCommandes() {
  const [filterEtat, setFilterEtat] = useState("all");
  const [allCommandes, setAllCommandes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCommandes = useCallback(() => {
    getAllCommandes()
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
  const annuleeCount = allCommandes.filter(c => c.etat === 'annulee').length;

  const filteredCommandes = filterEtat === "all"
    ? allCommandes
    : allCommandes.filter(c => {
        if (filterEtat === 'enlivraison') return c.etat === 'enlivraison' || c.etat === 'en livraison';
        return c.etat === filterEtat;
      });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Top Header & Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>إضافة طلب جديد (Nouveau)</span>
          </button>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-extrabold text-gray-900">إدارة ومتابعة كل الطلبات</h1>
            <p className="text-xs text-gray-500 mt-1">لوحة التحكم في سير عمليات التوصيل بالقصرين</p>
          </div>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-right">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold">إجمالي الطلبات</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{allCommandes.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ArchiveBoxIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-semibold">قيد الانتظار</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{encoursCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClockIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-semibold">في الطريق</p>
              <p className="text-2xl font-black text-blue-700 mt-1">{enlivraisonCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TruckIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 font-semibold">تم التوصيل</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{livreeCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {[
            { id: "all", label: `الكل (${allCommandes.length})` },
            { id: "encours", label: `قيد الانتظار (${encoursCount})` },
            { id: "enlivraison", label: `في الطريق (${enlivraisonCount})` },
            { id: "livree", label: `تم التسليم (${livreeCount})` },
            { id: "annulee", label: `ملغاة (${annuleeCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterEtat(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                filterEtat === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
                <h2 className="text-lg font-bold text-gray-900">إضافة طلب توصيل جديد</h2>
              </div>
              
              <AdminAddCommandeModalContent
                onSuccess={() => {
                  setIsOpen(false);
                  fetchCommandes();
                }}
              />
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="w-full flex flex-col items-center">
          {loading ? (
            <div className="py-12 text-center text-gray-400">جاري تحميل الطلبات...</div>
          ) : filteredCommandes.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-gray-100 w-full p-8 text-gray-400">
              لا توجد طلبات في هذه الفئة حالياً.
            </div>
          ) : (
            filteredCommandes.map((commande) => (        
              <AdminSingleCommandes key={commande._id} commande={commande} onUpdate={fetchCommandes} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
