import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import { login } from '../axios/authApi'; // This file must exist

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ phoneNumber : phone, password : password });
      localStorage.setItem('token', res.data.token); 
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
    if (role === 'client') {
      navigate('/client');
    } else if (role === 'livreur') {
      navigate('/livreur');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      alert("Unknown user role.");
    }    } catch (err) {
      alert('Login failed. Check your credentials.');
      console.error(err);
    }
  };

  return (
    <>
      <MainNavBar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="text-end mt-5 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/registre" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
