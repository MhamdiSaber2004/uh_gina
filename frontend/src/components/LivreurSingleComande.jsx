import { useState } from "react";
import { 
  modifyEtatCommande, 
  setFraisLivraison, 
  toggleItemPickup, 
  togglePayeMagasin 
} from "../axios/commandeApi";
import { 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useToast } from "../context/ToastContext";

export default function LivreurSingleCommandes({ commande, onUpdate }) {
  const [etat, setEtat] = useState(commande.etat);
  const [frais, setFrais] = useState(commande.fraisLivraison || "");
  const [items, setItems] = useState(commande.items || []);
  const [payeMagasin, setPayeMagasin] = useState(Boolean(commande.payeAuMagasinParLivreur));
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const { showToast } = useToast();

  const getEtatConfig = (currentEtat) => {
    switch (currentEtat) {
      case 'livree':
        return {
          label: 'تم التسليم (Livrée)',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          Icon: CheckCircleIcon,
        };
      case 'en livraison':
      case 'enlivraison':
        return {
          label: 'قيد التوصيل معك (En livraison)',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          Icon: TruckIcon,
        };
      case 'annulee':
        return {
          label: 'ملغاة (Annulée)',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          Icon: XCircleIcon,
        };
      case 'encours':
      default:
        return {
          label: 'متاحة للاستلام (En cours)',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          Icon: ClockIcon,
        };
    }
  };

  const config = getEtatConfig(etat);
  const cleanPhone = String(commande.phone || '').replace(/\s+/g, '');

  const encoursHandled = async () => {
    setLoading(true);
    try {
      await modifyEtatCommande(commande._id, { 
        etat: "enlivraison",
        fraisLivraison: frais !== "" ? Number(frais) : commande.fraisLivraison,
        payeAuMagasinParLivreur: payeMagasin
      });
      setEtat("enlivraison");
      showToast("استلمت الطلب! توجّه الآن إلى العناوين والمتاجر 🛵", "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast("حدث خطأ أثناء استلام الطلب", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enlivraisonHandled = async () => {
    setLoading(true);
    try {
      await modifyEtatCommande(commande._id, { 
        etat: "livree",
        fraisLivraison: frais !== "" ? Number(frais) : commande.fraisLivraison,
        payeAuMagasinParLivreur: payeMagasin
      });
      setEtat("livree");
      showToast("أحسنت! تم تأكيد تسليم الطلب بنجاح ✅", "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast("حدث خطأ أثناء تحديث حالة الطلب", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFrais = async () => {
    if (frais === "") {
      showToast("يرجى إدخال معلوم التوصيل!", "error");
      return;
    }
    setLoading(true);
    try {
      await setFraisLivraison(commande._id, { fraisLivraison: Number(frais) });
      showToast("تم تحديث معلوم التوصيل بنجاح! 💵", "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast("فشل تحديث معلوم التوصيل", "error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle item pickup (multi-store item checklist)
  const handleToggleItemPickup = async (itemId, currentPickedUp) => {
    try {
      const res = await toggleItemPickup(commande._id, itemId, !currentPickedUp);
      setItems(res.data.commande.items || []);
      showToast(
        !currentPickedUp ? "تم تأكيد أخذ الغرض من المتجر! ✅" : "تم إلغاء أخذ الغرض",
        "info"
      );
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      showToast("فشل تحديث حالة استلام الغرض", "error");
    }
  };

  // Toggle driver payment to store
  const handleTogglePayeMagasin = async () => {
    const nextVal = !payeMagasin;
    try {
      await togglePayeMagasin(commande._id, nextVal);
      setPayeMagasin(nextVal);
      showToast(
        nextVal 
          ? "تم تسجيل أنك دفعت ثمن الغرض للمتجر مباشرة عند الاستلام 💰" 
          : "تم إلغاء تسجيل الدفع للمتجر",
        "success"
      );
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      showToast("فشل تحديث حالة الدفع للمتجر", "error");
    }
  };

  const formattedDate = commande.createdAt
    ? new Date(commande.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const formattedPickupDate = commande.pickedUpAt
    ? new Date(commande.pickedUpAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const totalCalculated = (commande.prixItems || 0) + (Number(frais) || 0);

  return (
    <div className="w-full max-w-xl bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 mb-4 border border-gray-100 text-right">
      {/* Header */}
      <div className="flex flex-row-reverse justify-between items-center pb-3 border-b border-gray-100">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${config.badgeClass}`}
        >
          <config.Icon className="w-4 h-4" />
          <span>{config.label}</span>
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          {formattedPickupDate && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">
              استلمته: {formattedPickupDate}
            </span>
          )}
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Store if specified */}
      {commande.storeName && (
        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50/60 p-2 rounded-xl mt-3">
          <span>المحل المقصود: {commande.storeName}</span>
          <BuildingStorefrontIcon className="w-4 h-4 text-indigo-600" />
        </div>
      )}

      {/* Client Info & Address */}
      <div className="pt-2 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dir-ltr">{commande.phone}</span>
          <span className="font-bold text-gray-900 inline-flex items-center gap-1">
            <span>{commande.clientName || 'الزبون'}</span>
            <UserIcon className="w-4 h-4 text-indigo-500" />
          </span>
        </div>

        <div className="flex items-center justify-end text-xs text-gray-600 gap-1">
          <span>{commande.adress}</span>
          <MapPinIcon className="w-4 h-4 text-red-500 shrink-0" />
        </div>

        {/* Multi-Store Items Pickup Checklist */}
        {Array.isArray(items) && items.length > 0 && (
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-2">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
              <span className="text-[11px] text-gray-500 font-medium">
                اضغط على الزر لتأكيد أخذ كل غرض عند زيارة المتجر
              </span>
              <p className="font-extrabold text-gray-900 flex items-center gap-1">
                <span>أغراض الطلبية ({items.length}):</span>
                <ShoppingBagIcon className="w-4 h-4 text-indigo-600" />
              </p>
            </div>

            <div className="divide-y divide-gray-200/60">
              {items.map((it, idx) => (
                <div key={it._id || idx} className="py-2.5 flex items-center justify-between gap-2">
                  
                  {/* Item Pickup Action Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleItemPickup(it._id, it.pickedUp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                      it.pickedUp
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                        : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-300"
                    }`}
                  >
                    {it.pickedUp ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                        <span>تم أخذه من المتجر ✓</span>
                      </>
                    ) : (
                      <span>أخذ الغرض (Item {idx + 1})</span>
                    )}
                  </button>

                  {/* Item Details & Thumbnail */}
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        <span className="font-bold text-indigo-600 ml-1">x{it.quantity || 1}</span> {it.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {it.price > 0 ? `${(it.price * (it.quantity || 1)).toFixed(2)} د.ت` : 'سعر تقريبي'}
                        {it.details && <span className="mr-1 text-gray-400">({it.details})</span>}
                      </div>
                    </div>

                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.name}
                        onClick={() => setPreviewImg(it.image)}
                        className="w-11 h-11 rounded-lg object-cover border border-amber-300 shrink-0 cursor-pointer hover:opacity-80 shadow-2xs"
                        title="اضغط لمعاينة صورة الغرض المطلوبة"
                      />
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback Description */}
        {commande.description && (!items || items.length === 0) && (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">تفاصيل الطلب:</p>
            <p className="whitespace-pre-wrap text-gray-600">{commande.description}</p>
          </div>
        )}

        {/* Driver Payment to Store Option ("دفع سعر الغرض عند أخذه") */}
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleTogglePayeMagasin}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              payeMagasin
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-300"
            }`}
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>{payeMagasin ? "دفعت ثمنه للمتجر ✓" : "سجل إذا دفعت للمتجر"}</span>
          </button>

          <div className="text-right">
            <span className="font-extrabold text-emerald-950 block text-xs">
              {payeMagasin ? "دفعت للمتجر نقداً عند الأخذ ✅" : "لم تدفع للمتجر بعد (مستحق على الإدارة)"}
            </span>
            <span className="text-[11px] text-gray-500">
              {payeMagasin
                ? "سيتم استرجاع ثمن السلع لك من الزبون عند التسليم"
                : "ستقوم الإدارة بتسوية الحساب مع المتجر لاحقاً"}
            </span>
          </div>
        </div>

        {/* Pricing & Delivery Fee Setting Box */}
        <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="0.00"
                value={frais}
                onChange={(e) => setFrais(e.target.value)}
                className="w-20 px-2 py-1 bg-white border border-gray-300 rounded-lg text-center font-bold text-xs"
              />
              <span className="font-bold">د.ت</span>
              {etat !== 'livree' && (
                <button
                  type="button"
                  onClick={handleSaveFrais}
                  disabled={loading}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition"
                >
                  حفظ
                </button>
              )}
            </div>
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <span>حدد معلوم التوصيل:</span>
              <BanknotesIcon className="w-4 h-4 text-amber-600" />
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-amber-200/60 text-xs">
            <span className="font-black text-gray-900 text-sm">
              {totalCalculated > 0 ? `${totalCalculated.toFixed(2)} د.ت` : (commande.prixItems > 0 ? `${commande.prixItems.toFixed(2)} د.ت + التوصيل` : 'حسب الحساب')}
            </span>
            <span className="font-bold text-gray-700">المبلغ الإجمالي لتحصيله من الزبون:</span>
          </div>
        </div>
      </div>

      {/* Driver Quick Actions: Call, WhatsApp */}
      <div className="grid grid-cols-2 gap-2 pt-3">
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>اتصال هاتفي</span>
        </a>
        <a
          href={`https://wa.me/216${cleanPhone}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition"
        >
          <span>مراسلة واتساب</span>
        </a>
      </div>

      {/* Main Delivery State Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        {etat === 'encours' && (
          <button
            onClick={encoursHandled}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:opacity-50"
          >
            <TruckIcon className="w-5 h-5" />
            <span>استلام الطلب والبدء بالتوصيل 🛵</span>
          </button>
        )}
        {(etat === 'enlivraison' || etat === 'en livraison') && (
          <button
            onClick={enlivraisonHandled}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:opacity-50"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>تأكيد إتمام التوصيل للزبون ✅</span>
          </button>
        )}
      </div>

      {/* Item Image Lightbox */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full bg-white p-2 rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={previewImg} alt="Preview" className="w-full max-h-[70vh] object-contain rounded-xl" />
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
