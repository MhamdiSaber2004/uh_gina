import { useState } from "react";
import { annulerCommande } from "../axios/commandeApi";
import { 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

export default function AdminSingleCommandes({ commande, onUpdate }) {
  const [etat, setEtat] = useState(commande.etat);
  const [loading, setLoading] = useState(false);

  const getEtatConfig = (currentEtat) => {
    switch (currentEtat) {
      case 'livree':
        return {
          label: 'تم التوصيل (Livrée)',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          Icon: CheckCircleIcon,
        };
      case 'en livraison':
      case 'enlivraison':
        return {
          label: 'قيد التوصيل (En livraison)',
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
          label: 'قيد الانتظار (En cours)',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          Icon: ClockIcon,
        };
    }
  };

  const config = getEtatConfig(etat);
  const cleanPhone = String(commande.phone || '').replace(/\s+/g, '');

  const annulerHandled = async () => {
    if (!window.confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    setLoading(true);
    try {
      await annulerCommande(commande._id);
      setEtat("annulee");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <span className="text-xs text-gray-500 font-medium">{formattedDate}</span>
      </div>

      {/* Store if specified */}
      {commande.storeName && (
        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50/60 p-2 rounded-xl mt-3">
          <span>المحل: {commande.storeName}</span>
          <BuildingStorefrontIcon className="w-4 h-4 text-indigo-600" />
        </div>
      )}

      {/* Info Rows */}
      <div className="pt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <a href={`tel:${cleanPhone}`} className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>{commande.phone}</span>
          </a>
          <span className="font-bold text-gray-900 inline-flex items-center gap-1">
            <span>{commande.clientName || 'الزبون'}</span>
            <UserIcon className="w-4 h-4 text-indigo-500" />
          </span>
        </div>

        <div className="flex items-center justify-end text-xs text-gray-600 gap-1">
          <span>{commande.adress}</span>
          <MapPinIcon className="w-4 h-4 text-red-500 shrink-0" />
        </div>

        {commande.livreurName && (
          <div className="bg-indigo-50/70 p-2 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
            <span className="font-semibold">{commande.livreurName}</span>
            <span className="text-indigo-600">السائق المسند:</span>
          </div>
        )}

        {/* Items List */}
        {Array.isArray(commande.items) && commande.items.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 space-y-1">
            <p className="font-bold text-gray-900 flex items-center justify-end gap-1">
              <span>الأغراض المطلوبة ({commande.items.length}):</span>
              <ShoppingBagIcon className="w-4 h-4 text-indigo-600" />
            </p>
            <div className="divide-y divide-gray-200/60">
              {commande.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-900">
                    {it.price > 0 ? `${(it.price * (it.quantity || 1)).toFixed(2)} د.ت` : '-'}
                  </span>
                  <span>
                    <span className="font-bold text-indigo-600 ml-1">x{it.quantity || 1}</span> {it.name}
                    {it.details && <span className="text-gray-400 block text-[11px]">{it.details}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback Description */}
        {commande.description && (!commande.items || commande.items.length === 0) && (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">تفاصيل الطلب:</p>
            <p className="whitespace-pre-wrap text-gray-600">{commande.description}</p>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between text-gray-600">
            <span className="font-bold text-gray-800">{commande.prixItems ? `${commande.prixItems.toFixed(2)} د.ت` : '0.00 د.ت'}</span>
            <span>مجموع المشتريات:</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="font-bold text-indigo-700">{commande.fraisLivraison ? `${commande.fraisLivraison.toFixed(2)} د.ت` : 'لم يحدد بعد'}</span>
            <span>معلوم التوصيل:</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-sm text-gray-900">
            <span className="text-emerald-700">{commande.prixTotal ? `${commande.prixTotal.toFixed(2)} د.ت` : (commande.prixItems ? `${commande.prixItems.toFixed(2)} د.ت` : '0.00 د.ت')}</span>
            <span>المجموع النهائي:</span>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      {etat !== 'livree' && etat !== 'annulee' && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={annulerHandled}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            <XCircleIcon className="w-4 h-4" />
            <span>إلغاء الطلب (Annuler)</span>
          </button>
        </div>
      )}
    </div>
  );
}
