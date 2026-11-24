import { useState } from 'react';
import MainNavBar from '../components/MainNavBar';
import { register } from '../axios/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import logo from '../../public/logo.jpg';

export default function Registre() {
  const [nom, setNom] = useState('');
  const [adress, setAdress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validerPassword, setValiderPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== validerPassword) {
      showToast('كلمتا المرور غير متطابقتين!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name: nom, phoneNumber: phone, adress, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      showToast('تم إنشاء حسابك بنجاح! مرحباً بك 🎉', 'success');

      const role = res.data.user.role;
      if (role === 'client') {
        navigate('/client');
      } else if (role === 'livreur') {
        navigate('/livreur');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      showToast('فشل التسجيل. يرجى التأكد من البيانات أو أن الرقم غير مسجل مسبقاً.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <MainNavBar />
      <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-right">
            <div className="text-center mb-6">
              <img src={logo} alt="Uh Gina" className="w-16 h-16 mx-auto rounded-2xl object-cover shadow-sm mb-2" />
              <h2 className="text-2xl font-black text-gray-900">إنشاء حساب جديد</h2>
              <p className="text-xs text-gray-500 mt-1">سجّل معنا واطلب كل ما تحتاجه لباب بيتك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="nom" className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل (Nom et Prénom)
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  placeholder="مثال: محمد بن علي"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
                />
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الهاتف (Numéro de téléphone)
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  required
                  placeholder="مثال: 98112233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
                />
              </div>

              <div>
                <label htmlFor="adress" className="block text-xs font-bold text-gray-700 mb-1">
                  العنوان بالقصرين (Adresse)
                </label>
                <input
                  id="adress"
                  name="adress"
                  type="text"
                  required
                  placeholder="مثال: القصرين، حي النور قرب الجامع"
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
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
                  placeholder="6 أحرف على الأقل"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
                />
              </div>

              <div>
                <label htmlFor="v_password" className="block text-xs font-bold text-gray-700 mb-1">
                  تأكيد كلمة المرور (Confirmer le mot de passe)
                </label>
                <input
                  id="v_password"
                  name="v_password"
                  type="password"
                  required
                  placeholder="أعد كتابة كلمة المرور"
                  value={validerPassword}
                  onChange={(e) => setValiderPassword(e.target.value)}
                  className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:outline-indigo-600 transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'جاري التسجيل...' : 'تسجيل الحساب (S’inscrire)'}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              عندك حساب مسجل؟{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                تسجيل الدخول هنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
