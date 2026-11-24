import { useState } from "react";
import { annulerCommande } from "../axios/commandeApi";
import { 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(commande.adress + ', Kasserine')}`;

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
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 text-gray-600">
            <span>{commande.adress}</span>
            <MapPinIcon className="w-4 h-4 text-red-500 shrink-0" />
          </a>
        </div>

        {commande.livreurName && (
          <div className="bg-indigo-50/70 p-2 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
            <span className="font-semibold">{commande.livreurName}</span>
            <span className="text-indigo-600">السائق المسند:</span>
          </div>
        )}

        {/* Order Details box */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-1">تفاصيل الطلب:</p>
          <p className="whitespace-pre-wrap text-gray-600">{commande.description}</p>
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
