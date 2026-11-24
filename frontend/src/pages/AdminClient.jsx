import { useEffect, useState } from "react";
import { getAllClients } from "../axios/authApi";
import { UserIcon, PhoneIcon, MapPinIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AdminClient() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClients()
      .then((res) => {
        setClients(res.data.users || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredClients = clients.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    String(c.phoneNumber || '').includes(search) ||
    (c.adress || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="بحث بالاسم أو الهاتف أو العنوان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:outline-indigo-600 text-right"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          </div>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-extrabold text-gray-900">سجل الزبائن ({clients.length})</h1>
            <p className="text-xs text-gray-500 mt-1">بيانات العملاء المسجلين وعناوينهم في القصرين</p>
          </div>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="py-12 text-center text-gray-400">جاري تحميل بيانات الزبائن...</div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-gray-100">
            لا يوجد زبون مطابق للبحث.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-right">
            {filteredClients.map((client) => {
              const cleanPhone = String(client.phoneNumber || '').replace(/\s+/g, '');
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((client.adress || '') + ', Kasserine')}`;

              return (
                <div key={client._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{client.name}</h3>
                      <span className="inline-block mt-0.5 text-[11px] font-medium text-gray-500">
                        زبون مسجل
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-end gap-1">
                      <a href={mapsUrl} target="_blank" rel="noreferrer" className="hover:underline text-gray-600 flex items-center gap-1">
                        <span>{client.adress || 'العنوان غير محدد'}</span>
                        <MapPinIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
                    >
                      <PhoneIcon className="w-3.5 h-3.5" />
                      <span>اتصال</span>
                    </a>
                    <span className="text-xs text-gray-700 font-semibold">{client.phoneNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
