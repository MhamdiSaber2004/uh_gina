import {modifyEtatCommande , annulerCommande} from "../axios/commandeApi";
export default function AdminSingleCommandes({ commande }) {
  const getEtatStyle = (etat) => {
    switch (etat) {
      case 'livree':
        return 'bg-green-100 text-green-700';
      case 'en livraison':
        return 'bg-blue-100 text-blue-700';
      case 'encours':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const encoursHandled = async (e) =>{
    const res = await modifyEtatCommande(e.target.value , {etat : "enlivraison"});
  }

  const enlivraisonHandled = async (e) =>{
    const res = await modifyEtatCommande(e.target.value , { etat : "livree"});
  }

  const annulerHandled = async (e)=>{
    const res = await  annulerCommande(e.target.value , { etat : "annulee"})
  }

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200 m-1">
      {/* Date and Etat (top row) */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{new Date(commande.createdAt).toISOString().slice(0, 10).replace(/-/g, '-')}</h2>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${getEtatStyle(commande.etat)}`}
        >
          {commande.etat}
        </span>
      </div>

      {/* Phone and Address */}
      <h6 className="text-sm font-semibold text-gray-800">
        {commande.phone} : {commande.adress}
      </h6>

      {/* Description */}
      <p className="text-sm text-gray-600">{commande.description}</p>

      {/* Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        {commande.etat !== 'livree' && commande.etat !== 'annulee' && (
          <button onClick={annulerHandled} value={commande._id} className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-medium">
            Annuler
          </button>
        )}
       
      </div>
    </div>
  );
}
