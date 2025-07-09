import { useState } from "react";
import {modifyUser} from "../axios/authApi"
export default function LivreurProfile() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [name, setName] = useState(user.name);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [newPassword , setNewPassword ] = useState("");
    const [vNewPassword , setVNewPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(user)
            console.log(e)
            if (newPassword === vNewPassword) {
                const updatedUser = await modifyUser(user.role , user.id ,{
                    name,
                    phoneNumber,
                    adress : "",
                    password : newPassword,
                    verifPassword : vNewPassword,
                });
                console.log(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                alert("Passwords do not match");
            }
        } catch (err) {
            alert("Error updating profile, please try again");
            console.error(err);
        }
    }
    

  return (
    <>
       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-2xl text-center font-bold text-gray-900">Modifier profile</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="Name" className="block text-sm/6 font-medium text-gray-900">
                            Name
                        </label>
                        <div className="mt-2">
                            <input
                            id="Name"
                            name="Name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="Name"
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
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            autoComplete="phone_number"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="new_password" className="block text-sm/6 font-medium text-gray-900">
                            New password
                        </label>
                        <div className="mt-2">
                            <input
                            id="new_password"
                            name="new_password"
                            type="text"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                            autoComplete="new_password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="v_new_password" className="block text-sm/6 font-medium text-gray-900">
                            Verif new password
                        </label>
                        <div className="mt-2">
                            <input
                            id="v_new_password"
                            name="v_new_password"
                            type="text"
                            value={vNewPassword}
                            onChange={(e)=>setVNewPassword(e.target.value)}
                            autoComplete="v_new_password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                   
                    
                    
                    <button
                    type="submit"
                    className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                    >
                    Modifier profile
                    </button>
                </form>
            </div>
        </div>
    </>
  );
}