import { useState } from "react";
import { modifyEtatCommande } from "../axios/commandeApi";
import { 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function LivreurSingleCommandes({ commande, onUpdate }) {
  const [etat, setEtat] = useState(commande.etat);
  const [loading, setLoading] = useState(false);

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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(commande.adress + ', Kasserine')}`;

  const encoursHandled = async () => {
    setLoading(true);
    try {
      await modifyEtatCommande(commande._id, { etat: "enlivraison" });
      setEtat("enlivraison");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enlivraisonHandled = async () => {
    setLoading(true);
    try {
      await modifyEtatCommande(commande._id, { etat: "livree" });
      setEtat("livree");
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

      {/* Client Info & Address */}
      <div className="pt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{commande.phone}</span>
          <span className="font-bold text-gray-900 inline-flex items-center gap-1">
            <span>{commande.clientName || 'الزبون'}</span>
            <UserIcon className="w-4 h-4 text-indigo-500" />
          </span>
        </div>

        <div className="flex items-center justify-end text-xs text-gray-600 gap-1">
          <span>{commande.adress}</span>
          <MapPinIcon className="w-4 h-4 text-red-500 shrink-0" />
        </div>

        {/* Order Details box */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-1">المطلوب توصيله:</p>
          <p className="whitespace-pre-wrap text-gray-600">{commande.description}</p>
        </div>
      </div>

      {/* Driver Quick Actions: Call, WhatsApp, Maps */}
      <div className="grid grid-cols-3 gap-2 pt-3">
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>اتصال</span>
        </a>
        <a
          href={`https://wa.me/216${cleanPhone}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition"
        >
          <span>واتساب</span>
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
        >
          <MapPinIcon className="w-4 h-4" />
          <span>الخريطة GPS</span>
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
    </div>
  );
}
