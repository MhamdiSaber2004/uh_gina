import { useEffect, useState } from "react";
import { getAllLivreurs, addlivreur } from "../axios/authApi";
import { useToast } from "../context/ToastContext";
import { PlusIcon, PhoneIcon, UserIcon, TruckIcon } from "@heroicons/react/24/outline";

export default function AdminLivreur() {
  const [livreurs, setLivreurs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getAllLivreurs()
      .then((res) => {
        setLivreurs(res.data.users || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const submitHundler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addlivreur({ name, phoneNumber, password });
      if (res.status === 200 || res.status === 201) {
        showToast("تمت إضافة عامل التوصيل بنجاح! 🛵", "success");
        setIsOpen(false);
        setName("");
        setPhoneNumber("");
        setPassword("");
        if (res.data?.user) {
          setLivreurs((prev) => [...prev, res.data.user]);
        }
      } 
    } catch (error) {
      showToast("فشلت إضافة السائق. تأكد من صحة رقم الهاتف.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>إضافة سائق جديد (Ajouter Livreur)</span>
          </button>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-extrabold text-gray-900">سائقو التوصيل (Livreurs)</h1>
            <p className="text-xs text-gray-500 mt-1">إدارة فريق التوصيل والاتصال المباشر بهم</p>
          </div>
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full text-right">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
                <h2 className="text-lg font-bold text-gray-900">تسجيل سائق توصيل جديد</h2>
              </div>

              <form onSubmit={submitHundler} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم السائق (Nom)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ريان القاسمي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف (Téléphone)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 22123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">كلمة المرور (Mot de passe)</label>
                  <input
                    type="password"
                    required
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50"
                  >
                    {loading ? "جاري الإضافة..." : "حفظ وإضافة السائق ✅"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Livreurs Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-right">
          {livreurs.map((livreur) => (
            <div key={livreur._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TruckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{livreur.name}</h3>
                  <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    سائق نشط
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:${livreur.phoneNumber}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  <span>اتصال</span>
                </a>
                <span className="text-xs text-gray-600 font-medium">{livreur.phoneNumber}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
