import {useEffect, useState} from "react";
import {getAllClients} from "../axios/authApi";

export default function AdminLivreur() {
  const [clients, setclients] = useState([]);

  useEffect(() => {
    getAllClients()
      .then((res) => {
        setclients(res.data.users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

 



  return (
    <>
    <div>
      <div className="grid grid-cols-1 m-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{client.name}</h2>
            <p>Phone : {client.phoneNumber}</p>
            <p>Adress : {client.adress}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}