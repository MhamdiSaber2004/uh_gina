import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCommandeByClient } from "../axios/commandeApi";
import { useToast } from "../context/ToastContext";
import { ShoppingBagIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function ClientAddCommand() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const [adress, setAdress] = useState(user?.adress || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: "🍔 وجبة مطعم", text: "وجبة من مطعم (...): تفاصيل الأكلات والمشروبات" },
    { label: "💊 دواء صيدلية", text: "أدوية من الصيدلية: أسماء الأدوية المطلوبة" },
    { label: "🛒 قضية الدار", text: "قضية ومشتريات: خضار، غلال، مواد غذائية" },
    { label: "📦 طرد أو وثائق", text: "توصيل طرد أو وثائق من (...) إلى (...)" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      showToast("يرجى كتابة تفاصيل ما تحتاجه في الطلب!", "error");
      return;
    }

    setLoading(true);
    try {
      const addCommande = await createCommandeByClient({ adress, phone, description: details });
      if (addCommande) {
        showToast("تم إرسال طلبك بنجاح! السائقون في طريقهم لخدمتك 🛵", "success");
        navigate("/client"); 
      }
    } catch (err) {
      showToast("فشل إرسال الطلب. يرجى المحاولة مرة أخرى.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-gray-100 text-right">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">طلب توصيل جديد</h1>
            <p className="text-xs text-gray-500 mt-1">اكتب ما تحتاجه وعنوانك وسنتكفل بالباقي فوراً</p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-600 mb-2 flex items-center justify-end gap-1">
              <span>نماذج سريعة لتسهيل الكتابة:</span>
              <SparklesIcon className="w-3.5 h-3.5 text-indigo-500" />
            </p>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDetails(p.text)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-xs border border-gray-200 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="details" className="block text-xs font-bold text-gray-700 mb-1">
                تفاصيل الطلب (ماذا تريد أن نشتري أو نوصل لك؟)
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={4}
                placeholder="اكتب اسم المحل أو الأغراض بالتفصيل..."
                value={details} 
                onChange={(e) => setDetails(e.target.value)}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
              ></textarea>
            </div>

            <div>
              <label htmlFor="adress" className="block text-xs font-bold text-gray-700 mb-1">
                عنوان التوصيل في القصرين (Adresse)
              </label>
              <input
                id="adress"
                name="adress"
                type="text"
                required
                placeholder="مثال: القصرين، حي الزهور، قرب صيدلية السلام"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-xs font-bold text-gray-700 mb-1">
                رقم الهاتف للتواصل (Téléphone)
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                placeholder="مثال: 98112233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                {loading ? "جاري الإرسال..." : "تأكيد وإرسال الطلب 🛵"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
