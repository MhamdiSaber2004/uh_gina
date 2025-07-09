import {useEffect, useState} from "react";
import {getAllLivreurs} from "../axios/authApi";
import {addlivreur} from "../axios/authApi";

export default function AdminLivreur() {
  const [livreurs, setLivreurs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [name , setName] = useState("");
  const [phoneNumber , setPhoneNumber] = useState("");
  const [password , setPassword] = useState("");

  useEffect(() => {
    getAllLivreurs()
      .then((res) => {
        setLivreurs(res.data.users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const submitHundler = async (e) => {
    try{
      const res = await addlivreur({ name, phoneNumber, password });
      if (res.status === 200) {
        setIsOpen(false);
        setName("");
        setPhoneNumber("");
        setPassword("");
      } 
    }catch(error){
      console.error(error)
    }

  }



  return (
    <>
    <div>
      <div className="mb-4 text-center space-x-2 m-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Livreur
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0  bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg  max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Livreur</h2>
            {/* Add your form for adding a livreur here */}
            <form onSubmit={submitHundler}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone Number</label>
                  <input type="text" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Mot de pass</label>
                  <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                {/* Add more fields as necessary */}
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Livreur
                </button>
              </form>

            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 float-end"
            >
              Close 
            </button>
          </div>
        </div>


      )}
      <div className="grid grid-cols-1 m-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {livreurs.map((livreur) => (
          <div key={livreur._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{livreur.name}</h2>
            <p>Phone : {livreur.phoneNumber}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}