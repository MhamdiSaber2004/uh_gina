import { useEffect, useState } from "react";
import { getAllClients } from "../axios/authApi";
import { createCommandeByAdmin } from "../axios/commandeApi";
import { useToast } from "../context/ToastContext";

export default function AdminAddCommandeModalContent({ onSuccess }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getAllClients()
      .then((res) => {
        setClients(res.data.users || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient?._id) {
      showToast("يرجى اختيار الزبون أولاً!", "error");
      return;
    }
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    setLoading(true);
    try {
      const res = await createCommandeByAdmin({
        userId: selectedClient?._id,
        adress: data.adress,
        phone: data.phone_number,
        description: data.details,
      });
      if (res.status === 200 || res.status === 201) {
        showToast("تم إنشاء وتعيين الطلب بنجاح! 🎉", "success");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Error creating commande:", err);
      showToast("فشل إنشاء الطلب، يرجى المحاولة لاحقاً.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c._id === clientId);
    setSelectedClient(client || {});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      <div>
        <label htmlFor="client" className="block text-xs font-bold text-gray-700 mb-1">
          الزبون (Choisir le client)
        </label>
        <select
          name="client"
          id="client"
          required
          onChange={handleClientChange}
          className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 text-right"
        >
          <option value="">-- اختر الزبون من القائمة --</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name} ({client.phoneNumber})
            </option>
          ))}
        </select>
      </div>

      <input type="text" value={selectedClient?.name || ""} className="hidden" readOnly />

      <div>
        <label htmlFor="details" className="block text-xs font-bold text-gray-700 mb-1">
          تفاصيل الأغراض أو الطلب (Détails)
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={3}
          placeholder="تفاصيل ما طلبه الزبون..."
          className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600"
        ></textarea>
      </div>

      <div>
        <label htmlFor="adress" className="block text-xs font-bold text-gray-700 mb-1">
          عنوان التوصيل (Adresse)
        </label>
        <input
          id="adress"
          name="adress"
          type="text"
          required
          placeholder="عنوان الزبون في القصرين"
          value={selectedClient?.adress || ""}
          onChange={(e) =>
            setSelectedClient({ ...selectedClient, adress: e.target.value })
          }
          className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600"
        />
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-xs font-bold text-gray-700 mb-1">
          رقم هاتف الزبون (Téléphone)
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="text"
          required
          placeholder="رقم الهاتف"
          value={selectedClient?.phoneNumber || ""}
          onChange={(e) =>
            setSelectedClient({ ...selectedClient, phoneNumber: e.target.value })
          }
          className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "إضافة وتأكيد الطلب 🛵"}
        </button>
      </div>
    </form>
  );
}
