import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCommandeByClient } from "../axios/commandeApi";
import { getAllStores } from "../axios/storeApi";
import { useToast } from "../context/ToastContext";
import { 
  ShoppingBagIcon, 
  BuildingStorefrontIcon, 
  PlusIcon, 
  TrashIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

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
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Stores
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  // Order Items List
  const [items, setItems] = useState([]);

  // Manual Item Inputs
  const [customName, setCustomName] = useState("");
  const [customQty, setCustomQty] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [customDetails, setCustomDetails] = useState("");

  useEffect(() => {
    getAllStores()
      .then((res) => {
        setStores(res.data.stores || []);
      })
      .catch((err) => console.error("Error fetching stores:", err));
  }, []);

  const handleSelectStore = (storeId) => {
    if (!storeId) {
      setSelectedStore(null);
      return;
    }
    const found = stores.find((s) => s._id === storeId);
    setSelectedStore(found || null);
  };

  const addItemFromStore = (storeItem) => {
    // Check if already in items list, increment quantity
    setItems((prev) => {
      const existing = prev.find((it) => it.name === storeItem.name);
      if (existing) {
        return prev.map((it) =>
          it.name === storeItem.name ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [
        ...prev,
        {
          name: storeItem.name,
          price: storeItem.price,
          quantity: 1,
          details: storeItem.description || "",
        },
      ];
    });
    showToast(`تمت إضافة "${storeItem.name}" إلى القائمة!`, "success");
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      showToast("يرجى إدخال اسم الغرض!", "error");
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        name: customName.trim(),
        price: Number(customPrice) || 0,
        quantity: Number(customQty) || 1,
        details: customDetails.trim(),
      },
    ]);
    setCustomName("");
    setCustomQty(1);
    setCustomPrice("");
    setCustomDetails("");
  };

  const updateQuantity = (index, delta) => {
    setItems((prev) =>
      prev
        .map((it, idx) => {
          if (idx === index) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0 && !notes.trim()) {
      showToast("يرجى إضافة غرض واحد على الأقل أو كتابة تفاصيل الطلب!", "error");
      return;
    }

    setLoading(true);
    try {
      const addCommande = await createCommandeByClient({
        adress,
        phone,
        description: notes,
        items,
        store: selectedStore?._id || null,
        storeName: selectedStore?.name || "",
      });

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
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 text-right space-y-6">
          
          {/* Header */}
          <div className="text-center pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">إنشاء طلب توصيل جديد</h1>
            <p className="text-xs text-gray-500 mt-1">اختر من المتاجر أو أضف قائمة الأغراض والأسعار بنفسك</p>
          </div>

          {/* 1. Store Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-end gap-1">
              <span>اختر متجراً أو محلاً بالقصرين (اختياري):</span>
              <BuildingStorefrontIcon className="w-4 h-4 text-indigo-600" />
            </label>
            <select
              value={selectedStore?._id || ""}
              onChange={(e) => handleSelectStore(e.target.value)}
              className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-xs sm:text-sm text-right focus:bg-white focus:outline-indigo-600"
            >
              <option value="">-- بدون متجر محدد (طلب مخصص) --</option>
              {stores.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.category === 'restaurant' ? 'مطعم' : s.category === 'pharmacie' ? 'صيدلية' : 'متجر'}) - {s.adress}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Store Available Items (if store selected) */}
          {selectedStore && selectedStore.items && selectedStore.items.length > 0 && (
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
              <p className="text-xs font-bold text-indigo-900 flex items-center justify-end gap-1">
                <span>منتجات ووجبات متوفرة لدى {selectedStore.name}:</span>
                <SparklesIcon className="w-4 h-4 text-indigo-600" />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStore.items.map((it) => (
                  <div
                    key={it._id}
                    className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center justify-between shadow-xs hover:border-indigo-300 transition"
                  >
                    <button
                      type="button"
                      onClick={() => addItemFromStore(it)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>إضافة</span>
                    </button>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-xs">{it.name}</p>
                      <p className="text-[11px] font-bold text-emerald-600">{it.price.toFixed(2)} د.ت</p>
                      {it.description && <p className="text-[10px] text-gray-500">{it.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Add Custom Item Form */}
          <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/60 space-y-3">
            <p className="text-xs font-bold text-gray-800">أضف غرضاً / سلعة إلى قائمة طلبك:</p>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="اسم الغرض (مثال: بيتزا، حليب...)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-xl bg-white border border-gray-200 p-2 text-xs text-right focus:outline-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  placeholder="الكمية"
                  value={customQty}
                  onChange={(e) => setCustomQty(e.target.value)}
                  className="w-full rounded-xl bg-white border border-gray-200 p-2 text-xs text-center focus:outline-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="السعر (د.ت)"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full rounded-xl bg-white border border-gray-200 p-2 text-xs text-center focus:outline-indigo-600"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="w-full h-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>أضف للقائمة</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Display Current Order Items List */}
          {items.length > 0 && (
            <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-xs font-bold">
                <span className="text-indigo-600">المجموع: {subtotal.toFixed(2)} د.ت</span>
                <span className="text-gray-900">قائمة الأغراض المضافة ({items.length})</span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-900">
                        {it.price > 0 ? `${(it.price * it.quantity).toFixed(2)} د.ت` : 'سعر تقريبي'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold"
                        >
                          +
                        </button>
                        <span className="px-2 font-bold text-indigo-700">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold"
                        >
                          -
                        </button>
                      </div>
                      <span className="font-bold text-gray-800">{it.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Delivery Details (Address, Phone, Extra Notes) */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-gray-700 mb-1">
                ملاحظات إضافية على الطلب (اختياري)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="أي توضيحات أو تعليمات خاصة للسائق..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
              ></textarea>
            </div>

            <div>
              <label htmlFor="adress" className="block text-xs font-bold text-gray-700 mb-1">
                عنوان التوصيل بالقصرين (Adresse)
              </label>
              <input
                id="adress"
                name="adress"
                type="text"
                required
                placeholder="مثال: القصرين، حي الزهور قرب الصيدلية"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
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
                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
              />
            </div>

            {/* Price Preview */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-indigo-700 font-bold">يحدده السائق عند الاستلام</span>
              <span className="text-gray-500">معلوم التوصيل:</span>
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
