import { useState } from 'react';
import MainNavBar from '../components/MainNavBar'
import { register } from '../axios/authApi';
import { useNavigate } from 'react-router-dom';

export default function Registre() {
  const [nom, setnom] = useState('');
  const [adress, setadress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validerPassword , setValiderPassword] = useState('');
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      if(password === validerPassword){
        const res = await register({ name : nom, phoneNumber : phone, adress ,password } )
        console.log(res.data)  
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
         const role = res.data.user.role;
        if (role === 'client') {
          Navigate('/client');
        } else if (role === 'livreur') {
          Navigate('/livreur');
        } else if (role === 'admin') {
          Navigate('/admin');
        } else {
          alert("Unknown user role.");
        }
      }else{
        alert("check password")
      }
    }catch(err){
      alert('try again')
      console.error(err)
    }
  }

  return (
    <>
    <MainNavBar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
             <div>
              <label htmlFor="nom" className="block text-sm/6 font-medium text-gray-900">
                nom
              </label>
              <div className="mt-2">
                <input
                  id="nom"
                  name="nom"
                  type="nom"
                  value={nom}
                  onChange={(e)=>{setnom(e.target.value)}}
                  required
                  autoComplete="nom"
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
                  type="phone_number"
                  value={phone}
                  onChange={(e)=>{setPhone(e.target.value)}}
                  required
                  autoComplete="phone_number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adress" className="block text-sm/6 font-medium text-gray-900">
                adress
              </label>
              <div className="mt-2">
                <input
                  id="adress"
                  name="adress"
                  type="adress"
                  value={adress}
                  onChange={(e)=>{setadress(e.target.value)}}
                  required
                  autoComplete="adress"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="v_password" className="block text-sm/6 font-medium text-gray-900">
                  verifer Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="v_password"
                  name="v_password"
                  type="v_password"
                  value={validerPassword}
                  onChange={(e)=>{setValiderPassword(e.target.value)}}
                  required
                  autoComplete="current-v_password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
