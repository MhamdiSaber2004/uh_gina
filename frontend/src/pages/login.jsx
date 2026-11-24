import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import { login } from '../axios/authApi';
import { useToast } from '../context/ToastContext';
import logo from '../../public/logo.jpg';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ phoneNumber: phone, password: password });
      localStorage.setItem('token', res.data.token); 
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      showToast(`مرحباً بك مجدداً، ${res.data.user.name || ''}! 👋`, 'success');

      if (role === 'client') {
        navigate('/client');
      } else if (role === 'livreur') {
        navigate('/livreur');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        showToast('دور مستخدم غير محدد', 'error');
      }
    } catch (err) {
      showToast('فشل تسجيل الدخول. تأكد من رقم الهاتف وكلمة المرور.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <MainNavBar />
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-right">
            <div className="text-center mb-6">
              <img src={logo} alt="Uh Gina" className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-sm mb-3" />
              <h2 className="text-2xl font-black text-gray-900">تسجيل الدخول</h2>
              <p className="text-xs text-gray-500 mt-1">أدخل رقم هاتفك وكلمة المرور للوصول لحسابك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone_number" className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الهاتف (Numéro de téléphone)
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  required
                  placeholder="مثال: 29146431"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1">
                  كلمة المرور (Mot de passe)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'جاري التحقق...' : 'دخول (Se connecter)'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
              ما زال ما عندكش حساب؟{' '}
              <Link to="/registre" className="font-bold text-indigo-600 hover:text-indigo-500">
                سجّل حساب جديد مجاناً
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
