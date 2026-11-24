import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createCommandeByClient } from "../axios/commandeApi";
import { getAllStores } from "../axios/storeApi";
import { useToast } from "../context/ToastContext";
import {
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function ClientAddCommand() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const checkoutRef = useRef(null);

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

  // Stores & Items state
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // Order Items in Cart
  const [items, setItems] = useState([]);

  // Manual Custom Item Form State
  const [showManualForm, setShowManualForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customQty, setCustomQty] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [customImage, setCustomImage] = useState("");

  // Preview Image Modal
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setStoresLoading(true);
      const res = await getAllStores();
      const loadedStores = res.data.stores || [];
      setStores(loadedStores);

      if (loadedStores.length > 0 && !selectedStore) {
        setSelectedStore(loadedStores[0]);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setStoresLoading(false);
    }
  };

  // Add item from store catalog
  const addItemFromStore = (storeItem) => {
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
          price: Number(storeItem.price) || 0,
          quantity: 1,
          details: storeItem.description || "",
          image: storeItem.image || "",
        },
      ];
    });
    showToast(`تمت إضافة "${storeItem.name}" إلى السلة!`, "success");
  };

  // Upload image for custom item
  const handleCustomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("حجم الصورة كبير جداً، اختر صورة أقل من 5 ميغابايت", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target.result);
      showToast("تم إرفاق صورة المنتج المطلوب بنجاح! 📸", "success");
    };
    reader.readAsDataURL(file);
  };

  // Add manual custom item (either for selected store or custom order)
  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      showToast("يرجى إدخال اسم الغرض المطلوب!", "error");
      return;
    }

    const newItem = {
      name: customName.trim(),
      price: customPrice ? parseFloat(customPrice) : 0,
      quantity: Number(customQty) || 1,
      details: customDetails.trim() || (selectedStore ? `طلب خاص من ${selectedStore.name}` : "طلب مخصص"),
      image: customImage || "",
    };

    setItems((prev) => [...prev, newItem]);
    showToast(`تمت إضافة "${newItem.name}" لطلبيتك!`, "success");

    // Reset manual form
    setCustomName("");
    setCustomQty(1);
    setCustomPrice("");
    setCustomDetails("");
    setCustomImage("");
    setShowManualForm(false);
  };

  const updateItemQuantity = (index, delta) => {
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

  const getStoreItemQuantityInCart = (itemName) => {
    const found = items.find((it) => it.name === itemName);
    return found ? found.quantity : 0;
  };

  const itemsSubtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!adress.trim() || !phone.trim()) {
      showToast("يرجى كتابة عنوان التوصيل ورقم الهاتف!", "error");
      return;
    }

    if (items.length === 0 && !notes.trim()) {
      showToast("يرجى إضافة سلع إلى طلبيتك أولاً!", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await createCommandeByClient({
        adress: adress.trim(),
        phone: phone.trim(),
        description: notes.trim(),
        items: items,
        store: selectedStore?._id || null,
        storeName: selectedStore?.name || "طلب مخصص",
      });

      if (res) {
        showToast("تم إرسال طلبك بنجاح! السائقون في طريقهم لخدمتك 🛵", "success");
        navigate("/client");
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "فشل إرسال الطلب، يرجى المحاولة ثانية", "error");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["الكل", "مطعم", "صيدلية", "سوبرماركت", "مقهى", "أخرى"];
  
  const filteredStores = stores.filter((s) => {
    const matchesCat =
      categoryFilter === "الكل" ||
      (s.category || "").toLowerCase().includes(categoryFilter.toLowerCase()) ||
      (categoryFilter === "مطعم" && (s.category === "restaurant" || s.category === "مطعم")) ||
      (categoryFilter === "صيدلية" && (s.category === "pharmacie" || s.category === "صيدلية")) ||
      (categoryFilter === "سوبرماركت" && (s.category === "epicerie" || s.category === "سوبرماركت"));

    const matchesSearch =
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.items || []).some((item) =>
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCat && matchesSearch;
  });

  const scrollToCheckout = () => {
    if (checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-right" dir="rtl">
      
      {/* Top Banner Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <BuildingStorefrontIcon className="w-7 h-7 text-indigo-600" />
              المتاجر والمنتجات في القصرين
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              اختر متجرك المفضل، أضف السلع بالصور مباشرة إلى طلبيتك، أو أضف أي غرض مخصص مع صورته
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedStore(null);
              setShowManualForm(true);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
              !selectedStore
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
            }`}
          >
            <PencilSquareIcon className="w-4 h-4" />
            <span>طلب حر من مكان غير موجود بالقائمة</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* RIGHT / MAIN CONTENT: Store Selector & Products */}
          <div className="lg:col-span-7 space-y-6">

            {/* Category Filter Pills & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن متجر، مطعم، صيدلية، أو وجبة معينة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:outline-indigo-600"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                      categoryFilter === cat
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stores List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
                  <BuildingStorefrontIcon className="w-4 h-4 text-indigo-600" />
                  قائمة المتاجر المتاحة ({filteredStores.length}):
                </h2>
                {selectedStore && (
                  <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg">
                    المتجر المختار: {selectedStore.name}
                  </span>
                )}
              </div>

              {storesLoading ? (
                <div className="py-8 text-center text-xs text-gray-400">جاري تحميل المتاجر...</div>
              ) : filteredStores.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl text-center text-xs text-gray-400 border border-gray-100">
                  لا يوجد متجر مطابق لبحثك. يمكنك استخدام زر "طلب حر" أعلاه لطلب ما تريده مباشرة!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredStores.map((store) => {
                    const isSelected = selectedStore?._id === store._id;
                    const itemsCount = store.items?.length || 0;

                    return (
                      <div
                        key={store._id}
                        onClick={() => setSelectedStore(store)}
                        className={`cursor-pointer bg-white p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                          isSelected
                            ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20"
                            : "border-gray-200/80 hover:border-indigo-300 shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              {store.category || "متجر"}
                            </span>
                            <h3 className="text-sm font-extrabold text-gray-900">{store.name}</h3>
                          </div>

                          {store.address && (
                            <p className="text-[11px] text-gray-500 flex items-center justify-end gap-1 mt-1.5">
                              <span>{store.address}</span>
                              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
                            </p>
                          )}

                          {store.phone && (
                            <p className="text-[11px] text-gray-400 flex items-center justify-end gap-1 mt-0.5 dir-ltr">
                              <span>{store.phone}</span>
                              <PhoneIcon className="w-3 h-3 text-gray-400" />
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">
                            {itemsCount} {itemsCount === 1 ? "سلعة متوفرة" : "سلع متوفرة"}
                          </span>
                          <span
                            className={`font-bold inline-flex items-center gap-1 ${
                              isSelected ? "text-indigo-600" : "text-gray-400"
                            }`}
                          >
                            <span>{isSelected ? "المتجر المحدد ✓" : "تصفح القائمة"}</span>
                            <ChevronLeftIcon className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Store's Products Catalog with Images */}
            {selectedStore && (
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
                      <SparklesIcon className="w-5 h-5 text-indigo-600" />
                      منتجات ووجبات ({selectedStore.name})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      اضغط على زر (إضافة +) لوضع أي منتج في طلبيتك
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl">
                    {selectedStore.items?.length || 0} منتج
                  </span>
                </div>

                {/* Products Grid */}
                {!selectedStore.items || selectedStore.items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    لا توجد منتجات مسجلة لهذا المتجر حالياً. يمكنك إضافة ما تريده يدوياً مع الصورة في الأسفل!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedStore.items.map((item) => {
                      const qtyInCart = getStoreItemQuantityInCart(item.name);

                      return (
                        <div
                          key={item._id}
                          className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/70 flex flex-col justify-between hover:border-indigo-300 transition"
                        >
                          <div>
                            {/* Product Image & Details Header */}
                            <div className="flex items-start gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  onClick={() => setPreviewImage(item.image)}
                                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 cursor-pointer hover:opacity-90 shadow-2xs"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-200/60 flex items-center justify-center text-gray-400 shrink-0">
                                  <PhotoIcon className="w-7 h-7" />
                                </div>
                              )}

                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-1">
                                  <span className="text-xs font-black text-emerald-600 whitespace-nowrap">
                                    {Number(item.price).toFixed(2)} د.ت
                                  </span>
                                  <h4 className="text-xs font-extrabold text-gray-900">{item.name}</h4>
                                </div>
                                {item.description && (
                                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-gray-200/50 flex items-center justify-between">
                            {qtyInCart > 0 ? (
                              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                                <span>في السلة: {qtyInCart}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-gray-400">متوفر</span>
                            )}

                            <button
                              type="button"
                              onClick={() => addItemFromStore(item)}
                              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xs transition"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              <span>إضافة</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Option to add custom item WITH IMAGE to this specific store */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {!showManualForm ? (
                    <button
                      type="button"
                      onClick={() => setShowManualForm(true)}
                      className="w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>هل تريد شيئاً غير موجود بقائمة {selectedStore.name}؟ أضفه يدوياً مع صورة هنا</span>
                    </button>
                  ) : (
                    <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                          <PencilSquareIcon className="w-4 h-4 text-amber-600" />
                          إضافة غرض مخصص بالصورة إلى طلبك من ({selectedStore.name})
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowManualForm(false)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          ✕ إلغاء
                        </button>
                      </div>

                      <form onSubmit={handleAddCustomItem} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            required
                            placeholder="اسم الغرض أو الوجبة المطلوبة..."
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-indigo-600"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            min="1"
                            placeholder="الكمية"
                            value={customQty}
                            onChange={(e) => setCustomQty(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-center focus:outline-indigo-600"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="السعر التقريبي (د.ت)"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-indigo-600"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            placeholder="تفاصيل إضافية (مثال: جبن إضافي، حجم كبير، ماركة محددة...)"
                            value={customDetails}
                            onChange={(e) => setCustomDetails(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-indigo-600"
                          />
                        </div>

                        {/* Image Attachment for Custom Product */}
                        <div className="sm:col-span-3 flex items-center gap-3">
                          <label className="cursor-pointer bg-white hover:bg-gray-50 border border-dashed border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-700 flex items-center gap-1.5 transition">
                            <PhotoIcon className="w-4 h-4 text-amber-600" />
                            <span>{customImage ? "تغيير الصورة المرفقة" : "📷 إرفاق صورة للمنتج المرغوب فيه"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCustomImageUpload}
                              className="hidden"
                            />
                          </label>
                          {customImage && (
                            <div className="flex items-center gap-1.5">
                              <img
                                src={customImage}
                                alt="Custom item"
                                className="w-9 h-9 rounded-lg object-cover border border-amber-400"
                              />
                              <button
                                type="button"
                                onClick={() => setCustomImage("")}
                                className="text-rose-500 text-[11px] font-bold hover:underline"
                              >
                                ✕ حذف
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-3 rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            + أضف للسلة
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Custom Order Mode (When no store is selected) */}
            {!selectedStore && (
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-indigo-200 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-extrabold text-indigo-900 flex items-center gap-1.5">
                    <PencilSquareIcon className="w-5 h-5 text-indigo-600" />
                    طلب حر من أي مكان في القصرين (بدون متجر محدد)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    أدخل أي سلعة أو غرض تريده، وأرفق صورته إن أردت، وسيذهب السائق لاقتنائه وإيصاله إليك
                  </p>
                </div>

                <form onSubmit={handleAddCustomItem} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-800">أضف غرضاً إلى قائمتك:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="اسم الغرض (مثال: دواء محدد، شاحن، قهوة...)"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        placeholder="الكمية"
                        value={customQty}
                        onChange={(e) => setCustomQty(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-center focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="السعر المقدر (د.ت)"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-indigo-600"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="ملاحظات أو عنوان المتجر الذي تريده منه..."
                        value={customDetails}
                        onChange={(e) => setCustomDetails(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-indigo-600"
                      />
                    </div>

                    {/* Image Attachment */}
                    <div className="sm:col-span-3 flex items-center gap-3">
                      <label className="cursor-pointer bg-white hover:bg-gray-50 border border-dashed border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-700 flex items-center gap-1.5 transition">
                        <PhotoIcon className="w-4 h-4 text-indigo-600" />
                        <span>{customImage ? "تغيير الصورة المرفقة" : "📷 إرفاق صورة للمنتج المرغوب فيه"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomImageUpload}
                          className="hidden"
                        />
                      </label>
                      {customImage && (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={customImage}
                            alt="Custom item"
                            className="w-9 h-9 rounded-lg object-cover border border-indigo-400"
                          />
                          <button
                            type="button"
                            onClick={() => setCustomImage("")}
                            className="text-rose-500 text-[11px] font-bold hover:underline"
                          >
                            ✕ حذف
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        + أضف للسلة
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* LEFT / CHECKOUT & CART: Sticky Order Summary */}
          <div ref={checkoutRef} className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200/80 space-y-4">
              
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="bg-indigo-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                  {items.length} {items.length === 1 ? "غرض" : "أغراض"}
                </span>
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
                  <ShoppingBagIcon className="w-5 h-5 text-indigo-600" />
                  سلة الطلبية (Mon Panier)
                </h2>
              </div>

              {/* Selected Store Badge */}
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">
                  {selectedStore ? selectedStore.name : "طلب مخصص (حر)"}
                </span>
                <span className="text-gray-500">المحل:</span>
              </div>

              {/* Items List in Cart with Image Thumbnails */}
              {items.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <ShoppingBagIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  السلة فارغة حالياً.
                  <p className="mt-1 text-[11px] text-gray-400">
                    تصفح المتاجر والمنتجات واضغط على زر (+ إضافة) للبدء!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                      {/* Price & Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-gray-300 hover:text-rose-500 transition p-1"
                          title="حذف"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-extrabold text-gray-900 whitespace-nowrap">
                          {item.price > 0 ? `${(item.price * item.quantity).toFixed(2)} د.ت` : "-"}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-lg text-xs">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(idx, -1)}
                          className="text-gray-600 hover:text-indigo-600 font-bold p-0.5"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(idx, 1)}
                          className="text-gray-600 hover:text-indigo-600 font-bold p-0.5"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Thumbnail & Name */}
                      <div className="flex items-center gap-2 flex-1 text-right justify-end">
                        <div className="truncate">
                          <h5 className="text-xs font-bold text-gray-900 truncate">{item.name}</h5>
                          {item.details && (
                            <p className="text-[10px] text-gray-400 truncate">{item.details}</p>
                          )}
                        </div>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            onClick={() => setPreviewImage(item.image)}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span className="font-extrabold text-gray-900">{itemsSubtotal.toFixed(2)} د.ت</span>
                  <span>مجموع ثمن السلع:</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-bold text-indigo-700">يحدده السائق عند الاستلام</span>
                  <span>معلوم التوصيل:</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-gray-900">
                  <span className="text-emerald-700">
                    {itemsSubtotal > 0 ? `${itemsSubtotal.toFixed(2)} د.ت + التوصيل` : "حسب السلع"}
                  </span>
                  <span>المبلغ الإجمالي التقريبي:</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    عنوان التوصيل في القصرين <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حي الزهور، قرب صيدلية كذا..."
                    value={adress}
                    onChange={(e) => setAdress(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    رقم الهاتف للاتصال <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="مثال: 98 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    ملاحظات أو تعليمات خاصة للسائق
                  </label>
                  <textarea
                    rows="2"
                    placeholder="أي تعليمات إضافية، توقيت، أو تفاصيل موقعك..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || (items.length === 0 && !notes.trim())}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>{loading ? "جاري إرسال الطلب..." : "تأكيد وإرسال الطلبية الآن 🛵"}</span>
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 cursor-pointer"
        >
          <div className="relative max-w-lg w-full bg-white p-3 rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Enlarged view"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-5 right-5 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Mobile */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-gray-900 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-gray-800">
          <div>
            <span className="text-xs text-gray-300">
              {items.length} أغراض بالسلة
            </span>
            <div className="text-sm font-black text-emerald-400">
              {itemsSubtotal > 0 ? `${itemsSubtotal.toFixed(2)} د.ت` : "طلب مخصص"}
            </div>
          </div>
          <button
            onClick={scrollToCheckout}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            <span>إتمام الطلب 🛵</span>
          </button>
        </div>
      )}

    </div>
  );
}
