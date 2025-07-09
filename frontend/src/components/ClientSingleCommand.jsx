export default function SingleCommand({ commande }) {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200 m-1">
      {/* Date and Etat (top row) */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{new Date(commande.createdAt).toISOString().slice(0, 10).replace(/-/g, '-')}</h2>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            commande.etat === 'livree'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {commande.etat}
        </span>
      </div>
      {commande.livreurName && (
        <h6 className="text-s font-semibold text-gray-800">
          livreur : {commande.livreurName}
        </h6>
      )}
      <h6 className="text-sm font-semibold text-gray-800">{commande.phone} : {commande.adress}</h6>
      {/* Description */}
      <p className="text-sm text-gray-600">{commande.description}</p>
    </div>
  );
}
