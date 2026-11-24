import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function SingleCommand({ commande }) {
  const getEtatConfig = (etat) => {
    switch (etat) {
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
          step: 2,
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

  const config = getEtatConfig(commande.etat);
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
      {commande.etat !== 'annulee' ? (
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
          تم إلغاء هذا الطلب من قِبل إدارة التطبيق
        </div>
      )}

      {/* Details & Address */}
      <div className="space-y-2 pt-2 text-sm text-gray-700">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="font-semibold text-gray-900 mb-1">تفاصيل الطلب:</p>
          <p className="text-gray-600 text-xs sm:text-sm whitespace-pre-wrap">{commande.description}</p>
        </div>

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
              <span>السائق المكلف: {commande.livreurName}</span>
              <UserIcon className="w-4 h-4 text-indigo-600" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
