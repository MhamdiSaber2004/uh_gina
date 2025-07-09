import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCommandeByClient } from "../axios/commandeApi";

export default function ClientAddCommand() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [adress, setAdress] = useState(user.adress);
  const [phone, setPhone] = useState(user.phoneNumber);
  const [details, setDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addCommande = await createCommandeByClient({ adress, phone, description : details });
      console.log(addCommande);
      if (addCommande) {
        navigate("/client"); 
      } else {
        alert("Failed to add command");
      }
    } catch (err) {
      alert("Try again");
      console.error(err);
    }
  };

  return (
    <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-2xl text-center font-bold text-gray-900">Add Command</h1>
                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="adress" className="block text-sm/6 font-medium text-gray-900">
                            Adress
                        </label>
                        <div className="mt-2">
                            <input
                            id="adress"
                            name="adress"
                            type="text"
                            required
                            value={adress}
                            onChange={(e) => setAdress(e.target.value)}
                            autoComplete="adress"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone_number" className="block text-sm/6 font-medium text-gray-900">
                            Phone Number
                        </label>
                        <div className="mt-2">
                            <input
                            id="phone_number"
                            name="phone_number"
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                            autoComplete="phone_number"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm/6 font-medium text-gray-900">
                            details
                        </label>
                        <div className="mt-2">
                            <textarea
                            id="details"
                            name="details"
                            type="text"
                            required
                            autoComplete="details"
                            rows={5}
                            value={details} 
                            onChange={(e)=>setDetails(e.target.value)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                            </textarea>
                        </div>
                    </div>
                    
                    <button
                    type="submit"
                    className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                    >
                    Add Command
                    </button>
                </form>
            </div>
        </div>
    </>
  );
}