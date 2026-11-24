import { useState } from 'react';
import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { annulerCommandeByClient } from '../axios/commandeApi';
import { useToast } from '../context/ToastContext';

export default function SingleCommand({ commande, onUpdate }) {
  const [etat, setEtat] = useState(commande.etat);
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const { showToast } = useToast();

  const getEtatConfig = (currentEtat) => {
    switch (currentEtat) {
      case 'livree':
        return {
          label: 'تم التوصيل بنجاح (Livrée)',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          step: 3,
          Icon: CheckCircleIcon,
        };
      case 'en livraison':
      case 'enlivraison':
        return {
          label: 'في طريقها إليك (En livraison)',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          Icon: TruckIcon,
        };
      case 'annulee':
        return {
          label: 'طلب ملغى (Annulée)',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          step: 0,
          Icon: XCircleIcon,
        };
      case 'encours':
      default:
        return {
          label: 'قيد الانتظار والمعالجة (En cours)',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          step: 1,
          Icon: ClockIcon,
        };
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟")) return;
    setLoading(true);
    try {
      const res = await annulerCommandeByClient(commande._id);
      setEtat('annulee');
      showToast("تم إلغاء الطلب بنجاح", "info");
      if (onUpdate) onUpdate();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "فشل إلغاء الطلب";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const config = getEtatConfig(etat);
  const formattedDate = commande.createdAt
    ? new Date(commande.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="w-full max-w-xl bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 mb-4 border border-gray-100 text-right">
      {/* Header: Date + Status Badge */}
      <div className="flex flex-row-reverse justify-between items-center pb-3 border-b border-gray-100">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${config.badgeClass}`}
        >
          <config.Icon className="w-4 h-4" />
          <span>{config.label}</span>
        </span>
        <span className="text-xs text-gray-500 font-medium">{formattedDate}</span>
      </div>

      {/* Stepper Timeline (if not cancelled) */}
      {etat !== 'annulee' ? (
        <div className="py-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <div className={`flex flex-col items-center gap-1 ${config.step >= 1 ? 'text-indigo-600' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold ${config.step >= 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 border-gray-300'}`}>1</span>
              <span>تم الطلب</span>
            </div>
            <div className={`flex-1 h-1 mx-2 rounded ${config.step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center gap-1 ${config.step >= 2 ? 'text-indigo-600' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold ${config.step >= 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 border-gray-300'}`}>2</span>
              <span>في الطريق</span>
            </div>
            <div className={`flex-1 h-1 mx-2 rounded ${config.step >= 3 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center gap-1 ${config.step >= 3 ? 'text-emerald-600' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold ${config.step >= 3 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-100 border-gray-300'}`}>3</span>
              <span>تم الاستلام</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-3 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs text-center font-medium border border-red-100">
          تم إلغاء هذا الطلب
        </div>
      )}

      {/* Store if specified */}
      {commande.storeName && (
        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50/60 p-2 rounded-xl mb-2">
          <span>المحل / المتجر: {commande.storeName}</span>
          <BuildingStorefrontIcon className="w-4 h-4 text-indigo-600" />
        </div>
      )}

      {/* Items list if exists */}
      {Array.isArray(commande.items) && commande.items.length > 0 && (
        <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 mb-3 space-y-2">
          <p className="text-xs font-bold text-gray-700 flex items-center justify-end gap-1">
            <span>قائمة الأغراض المطلوبة ({commande.items.length}):</span>
            <ShoppingBagIcon className="w-4 h-4 text-indigo-600" />
          </p>
          <div className="divide-y divide-gray-200/60">
            {commande.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs">
                <span className="font-bold text-gray-900">
                  {it.price > 0 ? `${(it.price * (it.quantity || 1)).toFixed(2)} د.ت` : 'سعر تقريبي'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-bold text-gray-800">
                      <span className="font-bold text-indigo-600 ml-1">x{it.quantity || 1}</span> {it.name}
                    </span>
                    {it.details && <span className="text-gray-400 text-[11px] block">{it.details}</span>}
                  </div>
                  {it.image && (
                    <img
                      src={it.image}
                      alt={it.name}
                      onClick={() => setPreviewImg(it.image)}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 cursor-pointer hover:opacity-80 shadow-2xs"
                      title="اضغط لتكبير الصورة"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Description */}
      {commande.description && (!commande.items || commande.items.length === 0) && (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3 text-xs sm:text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-1">تفاصيل الطلب:</p>
          <p className="text-gray-600 whitespace-pre-wrap">{commande.description}</p>
        </div>
      )}

      {/* Price Summary Breakdown */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1.5 mb-3">
        {commande.prixItems > 0 && (
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-bold text-gray-800">{commande.prixItems.toFixed(2)} د.ت</span>
            <span>مجموع المشتريات:</span>
          </div>
        )}
        <div className="flex justify-between items-center text-gray-600">
          <span className="font-bold text-indigo-700">
            {commande.fraisLivraison > 0 ? `${commande.fraisLivraison.toFixed(2)} د.ت` : 'يحدده السائق عند الاستلام'}
          </span>
          <span>معلوم التوصيل:</span>
        </div>
        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 font-extrabold text-sm text-gray-900">
          <span className="text-emerald-700">
            {commande.prixTotal > 0 ? `${commande.prixTotal.toFixed(2)} د.ت` : (commande.prixItems > 0 ? `${commande.prixItems.toFixed(2)} د.ت + التوصيل` : 'عند الاستلام')}
          </span>
          <span>المبلغ الإجمالي للدفع:</span>
        </div>
      </div>

      {/* Address & Phone */}
      <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-gray-600 pt-1">
        <span className="inline-flex items-center gap-1">
          <span>{commande.adress}</span>
          <MapPinIcon className="w-4 h-4 text-indigo-500" />
        </span>
        <span className="inline-flex items-center gap-1">
          <span>{commande.phone}</span>
          <PhoneIcon className="w-4 h-4 text-indigo-500" />
        </span>
        {commande.livreurName && (
          <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
            <span>السائق: {commande.livreurName}</span>
            <UserIcon className="w-4 h-4 text-indigo-600" />
          </span>
        )}
      </div>

      {/* Client Cancellation Action or Notice */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        {etat === 'encours' && (
          <button
            onClick={handleCancelOrder}
            disabled={loading}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "جاري الإلغاء..." : "إلغاء الطلب (Annuler)"}
          </button>
        )}
        {(etat === 'enlivraison' || etat === 'en livraison') && (
          <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl w-full text-center">
            🛵 السائق استلم طلبك وبدأ في التوصيل (لا يمكن إلغاء الطلب بعد الاستلام)
          </span>
        )}
      </div>

      {/* Image Lightbox */}
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
