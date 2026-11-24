import { useEffect, useState } from "react";
import {
  getAllStores,
  createStore,
  deleteStore,
  addItemToStore,
  deleteItemFromStore,
  recordStorePayment,
} from "../axios/storeApi";
import { useToast } from "../context/ToastContext";
import {
  BuildingStorefrontIcon,
  PlusIcon,
  TrashIcon,
  PhoneIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  BanknotesIcon,
  PhotoIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddStore, setShowAddStore] = useState(false);
  const [expandedStoreId, setExpandedStoreId] = useState(null);

  // New store form state
  const [newStore, setNewStore] = useState({
    name: "",
    category: "مطعم",
    phone: "",
    address: "",
    description: "",
  });
  const [submittingStore, setSubmittingStore] = useState(false);

  // New item form state per store
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [submittingItem, setSubmittingItem] = useState(false);

  // Payment modal state
  const [paymentModalStore, setPaymentModalStore] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const toast = useToast();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getAllStores();
      setStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل بيانات المتاجر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!newStore.name.trim()) {
      toast.warning("يرجى إدخال اسم المتجر");
      return;
    }

    try {
      setSubmittingStore(true);
      const res = await createStore(newStore);
      toast.success("تم إضافة المتجر بنجاح!");
      setStores([res.data.store, ...stores]);
      setNewStore({
        name: "",
        category: "مطعم",
        phone: "",
        address: "",
        description: "",
      });
      setShowAddStore(false);
      setExpandedStoreId(res.data.store._id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "فشل إضافة المتجر");
    } finally {
      setSubmittingStore(false);
    }
  };

  const handleDeleteStore = async (storeId, storeName) => {
    if (!window.confirm(`هل أنت متأكد من حذف متجر "${storeName}" وجميع سلعه؟`)) {
      return;
    }

    try {
      await deleteStore(storeId);
      toast.success("تم حذف المتجر بنجاح");
      setStores(stores.filter((s) => s._id !== storeId));
      if (expandedStoreId === storeId) setExpandedStoreId(null);
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف المتجر");
    }
  };

  // Convert uploaded image file to base64
  const handleItemImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميغابايت");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewItem((prev) => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = async (e, storeId) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.price) {
      toast.warning("يرجى إدخال اسم السلعة وسعرها");
      return;
    }

    try {
      setSubmittingItem(true);
      const res = await addItemToStore(storeId, {
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
        description: newItem.description.trim(),
        image: newItem.image || "",
      });

      toast.success("تمت إضافة السلعة مع الصورة بنجاح!");
      setStores(
        stores.map((s) => (s._id === storeId ? res.data.store : s))
      );
      setNewItem({ name: "", price: "", description: "", image: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "فشل إضافة السلعة");
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleDeleteItem = async (storeId, itemId, itemName) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${itemName}"؟`)) {
      return;
    }

    try {
      const res = await deleteItemFromStore(storeId, itemId);
      toast.success("تم حذف السلعة");
      setStores(
        stores.map((s) => (s._id === storeId ? res.data.store : s))
      );
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف السلعة");
    }
  };

  // Record payment to store
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.warning("يرجى إدخال مبلغ صحيح");
      return;
    }

    try {
      setSubmittingPayment(true);
      await recordStorePayment(paymentModalStore._id, amount);
      toast.success(`تم تسجيل دفع ${amount.toFixed(2)} د.ت للمتجر بنجاح!`);
      setPaymentModalStore(null);
      setPaymentAmount("");
      fetchStores();
    } catch (err) {
      console.error(err);
      toast.error("فشل تسجيل الدفعة");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.address || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalOwedAllStores = stores.reduce(
    (sum, s) => sum + (Number(s.totalOwed) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans text-right" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <BuildingStorefrontIcon className="w-7 h-7 text-amber-500" />
              إدارة المتاجر، السلع والديون ({stores.length})
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              إضافة المتاجر والسلع بالصور، ومتابعة المبالغ المستحقة لكل متجر (كم تدين له)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="بحث باسم المتجر، الصنف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:outline-amber-600"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <button
              onClick={() => setShowAddStore(!showAddStore)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition whitespace-nowrap"
            >
              <PlusIcon className="w-4 h-4" />
              <span>{showAddStore ? "إغلاق النموذج" : "إضافة متجر جديد"}</span>
            </button>
          </div>
        </div>

        {/* Global Financial Debt Summary Banner */}
        <div className="bg-linear-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BanknotesIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs text-amber-100 font-semibold">إجمالي المبالغ المستحقة لكافة المتاجر (مجموع ما تدين به):</span>
              <div className="text-2xl font-black">{totalOwedAllStores.toFixed(2)} د.ت</div>
            </div>
          </div>
          <p className="text-xs text-amber-100 max-w-md text-center sm:text-right">
            المبلغ المستحق يتم احتسابه آلياً من مجموع مشتريات الطلبات المسلّمة مطروحاً منها الدفعات المسجلة.
          </p>
        </div>

        {/* Add Store Form Panel */}
        {showAddStore && (
          <div className="bg-amber-50/60 border border-amber-200 p-6 rounded-2xl shadow-sm transition">
            <h2 className="text-base font-extrabold text-amber-950 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-amber-600" />
              بيانات المتجر الجديد
            </h2>

            <form onSubmit={handleCreateStore} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اسم المتجر <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مطعم السلام، صيدلية الليل..."
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الصنف</label>
                <select
                  value={newStore.category}
                  onChange={(e) => setNewStore({ ...newStore, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-amber-500"
                >
                  <option value="مطعم">مطعم (Restaurant / Fast Food)</option>
                  <option value="صيدلية">صيدلية (Pharmacie)</option>
                  <option value="سوبرماركت">سوبرماركت / بقالة (Supermarché / Épicerie)</option>
                  <option value="مقهى">مقهى / مخبزة (Café / Pâtisserie)</option>
                  <option value="خضار وغلال">خضار وغلال (Fruits & Légumes)</option>
                  <option value="جزارة">لحوم ودواجن (Boucherie)</option>
                  <option value="أخرى">أخرى (Autre)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  placeholder="مثال: 77 123 456"
                  value={newStore.phone}
                  onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">العنوان في القصرين</label>
                <input
                  type="text"
                  placeholder="مثال: شارع الحبيب بورقيبة، حي الزهور..."
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-amber-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStore(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingStore}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {submittingStore ? "جاري الحفظ..." : "حفظ المتجر"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stores Grid */}
        {loading ? (
          <div className="py-16 text-center text-gray-400 font-medium">جاري تحميل بيانات المتاجر والحسابات...</div>
        ) : filteredStores.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center text-gray-400 border border-gray-100">
            {search ? "لا يوجد متجر مطابق للبحث." : "لا توجد متاجر مضافة حالياً. اضغط على زر 'إضافة متجر جديد' للبدء!"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStores.map((store) => {
              const isExpanded = expandedStoreId === store._id;
              const itemsCount = store.items?.length || 0;
              const owedAmount = Number(store.totalOwed) || 0;
              const salesAmount = Number(store.totalSales) || 0;
              const paidAmount = Number(store.totalPaidToStore) || 0;

              return (
                <div
                  key={store._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition"
                >
                  {/* Store Header Row */}
                  <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <BuildingStorefrontIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-extrabold text-gray-900">{store.name}</h3>
                          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            {store.category || "متجر"}
                          </span>
                          <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {itemsCount} {itemsCount === 1 ? "سلعة" : itemsCount === 2 ? "سلعتان" : "سلع"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-500">
                          {store.phone && (
                            <span className="flex items-center gap-1">
                              <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                              <a href={`tel:${store.phone}`} className="hover:text-amber-600 dir-ltr">
                                {store.phone}
                              </a>
                            </span>
                          )}
                          {store.address && (
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
                              <span>{store.address}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Financial Debt & Balances Badge ("كم تدين له") */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-[11px] text-gray-500 block">المبلغ المستحق (كم تدين له):</span>
                        <span className={`text-sm font-black ${owedAmount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {owedAmount.toFixed(2)} د.ت
                        </span>
                      </div>
                      <div className="border-r border-slate-200 pr-3">
                        <span className="text-[11px] text-gray-400 block">إجمالي المبيعات:</span>
                        <span className="font-bold text-gray-800">{salesAmount.toFixed(2)} د.ت</span>
                      </div>
                      <div className="border-r border-slate-200 pr-3">
                        <span className="text-[11px] text-gray-400 block">تم دفعه له:</span>
                        <span className="font-bold text-emerald-700">{paidAmount.toFixed(2)} د.ت</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setPaymentModalStore(store);
                          setPaymentAmount("");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                      >
                        <BanknotesIcon className="w-3.5 h-3.5" />
                        <span>تسجيل دفعة للمتجر</span>
                      </button>
                    </div>

                    {/* Actions on Store */}
                    <div className="flex items-center gap-2 self-end lg:self-center w-full lg:w-auto justify-end">
                      <button
                        onClick={() => handleDeleteStore(store._id, store.name)}
                        title="حذف المتجر"
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">حذف</span>
                      </button>

                      <button
                        onClick={() => setExpandedStoreId(isExpanded ? null : store._id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                          isExpanded
                            ? "bg-amber-600 text-white border-amber-600"
                            : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-700 border-gray-200"
                        }`}
                      >
                        <span>{isExpanded ? "إخفاء السلع والمنتجات" : "إدارة السلع والمنتجات"}</span>
                        {isExpanded ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items Section */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/70 p-5 space-y-5">
                      
                      {/* Add Item Form with Image Support */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                        <h4 className="text-xs font-extrabold text-gray-900 mb-3 flex items-center gap-1.5">
                          <PlusIcon className="w-4 h-4 text-emerald-600" />
                          إضافة سلعة / منتج جديد بالصورة إلى ({store.name})
                        </h4>

                        <form
                          onSubmit={(e) => handleAddItem(e, store._id)}
                          className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                        >
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              اسم السلعة / الوجبة <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: كسكروت كفتاجي، بيتزا، علبة بنادول..."
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              السعر (DT) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              required
                              placeholder="مثال: 7.5"
                              value={newItem.price}
                              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-emerald-500"
                            />
                          </div>

                          {/* Image Upload Input */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center justify-between">
                              <span>صورة السلعة (اختياري)</span>
                              {newItem.image && (
                                <button
                                  type="button"
                                  onClick={() => setNewItem({ ...newItem, image: "" })}
                                  className="text-rose-500 text-[10px] hover:underline"
                                >
                                  حذف الصورة
                                </button>
                              )}
                            </label>
                            <div className="flex items-center gap-2">
                              {newItem.image && (
                                <img
                                  src={newItem.image}
                                  alt="Preview"
                                  className="w-8 h-8 rounded-lg object-cover border border-emerald-500 shrink-0"
                                />
                              )}
                              <label className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 text-center flex items-center justify-center gap-1">
                                <PhotoIcon className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{newItem.image ? "تغيير الصورة" : "اختر صورة..."}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleItemImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              placeholder="ملاحظات أو تفاصيل اختيارية (مثال: جبن إضافي، حجم كبير...)"
                              value={newItem.description}
                              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-emerald-500"
                            />
                          </div>

                          <div>
                            <button
                              type="submit"
                              disabled={submittingItem}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-bold shadow transition disabled:opacity-50"
                            >
                              {submittingItem ? "جاري الإضافة..." : "+ إضافة السلعة"}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Items List */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                          <TagIcon className="w-4 h-4 text-gray-400" />
                          قائمة السلع والأسعار المتاحة ({store.items?.length || 0}):
                        </h4>

                        {!store.items || store.items.length === 0 ? (
                          <p className="text-xs text-gray-400 bg-white p-4 rounded-xl border border-dashed border-gray-200 text-center">
                            لا توجد سلع مضافة بعد لهذا المتجر. استخدم النموذج أعلاه لإضافة أول سلعة بالصورة.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {store.items.map((item) => (
                              <div
                                key={item._id}
                                className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition"
                              >
                                <div className="flex items-center gap-2.5">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                      <PhotoIcon className="w-5 h-5" />
                                    </div>
                                  )}

                                  <div>
                                    <div className="text-xs font-bold text-gray-900">{item.name}</div>
                                    {item.description && (
                                      <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                                        {item.description}
                                      </div>
                                    )}
                                    <div className="text-xs font-black text-amber-600 mt-0.5">
                                      {Number(item.price).toFixed(2)} DT
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDeleteItem(store._id, item._id, item.name)}
                                  className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
                                  title="حذف هذه السلعة"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Record Payment Modal */}
      {paymentModalStore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl max-w-sm w-full space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <button
                onClick={() => setPaymentModalStore(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
              <h3 className="text-sm font-extrabold text-gray-900">
                تسجيل دفعة لمتجر ({paymentModalStore.name})
              </h3>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-rose-600">{Number(paymentModalStore.totalOwed || 0).toFixed(2)} د.ت</span>
                <span className="text-gray-600">المبلغ المستحق حالياً (كم تدين له):</span>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  المبلغ المدفوع (د.ت)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  placeholder="مثال: 50.0"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-center focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalStore(null)}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {submittingPayment ? "جاري التسجيل..." : "تأكيد تسجيل الدفعة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
