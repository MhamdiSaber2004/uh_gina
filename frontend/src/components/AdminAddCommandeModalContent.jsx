import { useEffect, useState } from "react";
import { getAllClients } from "../axios/authApi";
import {createCommandeByAdmin} from "../axios/commandeApi";

export default function AdminAddCommandeModalContent() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

    // Fetch all clients when the component mounts
  useEffect(() => {
    getAllClients()
      .then((res) => {
        setClients(res.data.users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const res = await createCommandeByAdmin({
            userId : selectedClient?._id,
            adress: data.adress,
            phone: data.phone_number,
            description: data.details,
        });
    } catch (err) {
      console.error("Error creating commande:", err);
      alert("Failed to create command. Please try again.");
    }
  }
    // Handle client selection change
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c._id === clientId);
    setSelectedClient(client || {});
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Client */}
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-900">
            Client
          </label>
          <select
            name="client"
            id="client"
            onChange={handleClientChange}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/*to get the name */}
        <input type="text" value={selectedClient?.name || ""} className="hidden"/>

        {/* Adress */}
        <div>
          <label htmlFor="adress" className="block text-sm font-medium text-gray-900">
            Address
          </label>
          <input
            id="adress"
            name="adress"
            type="text"
            required
            value={selectedClient?.adress || ""}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient, adress: e.target.value })
            }
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-900">
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="text"
            required
            value={selectedClient?.phoneNumber || ""}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient, phoneNumber: e.target.value })
            }
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
          />
        </div>

        {/* Details */}
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-900">
            Details
          </label>
          <textarea
            id="details"
            name="details"
            required
            rows={5}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-indigo-600"
        >
          Add Command
        </button>
      </form>
    </>
  );
}
