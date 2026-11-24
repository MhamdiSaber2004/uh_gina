import { Link } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import logo from '../../public/logo.jpg';
import rayen from '../assets/rayen.jpg';
import { 
  PhoneIcon, 
  TruckIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const categories = [
    { name: 'مطاعم وأكلات سريعة', desc: 'من أي مطعم أو كافتيريا بالقصرين', icon: '🍔' },
    { name: 'صيدلية وأدوية', desc: 'خدمة عاجلة للوصفات والمستلزمات الطبية', icon: '💊' },
    { name: 'وثائق ومستندات', desc: 'توصيل موثوق بين الإدارات والمكاتب', icon: '📄' },
    { name: 'قضاء حوائج وقضية الدار', desc: 'خضار، غلال، مواد غذائية لباب بيتك', icon: '🛒' },
  ];

  const steps = [
    { title: '1. سجّل طلبك', desc: 'اكتب تفاصيل ما تحتاجه وعنوانك برقم هاتفك', icon: '📝' },
    { title: '2. نجهّز ونستلم', desc: 'سائقونا ينطلقون فوراً لقضاء حاجتك من المحل المطلوب', icon: '🛵' },
    { title: '3. استلم عند بابك', desc: 'توصيل سريع وفريش والدفع نقداً عند الاستلام', icon: '📦' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <MainNavBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-right space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/60 text-indigo-200 text-sm font-medium border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              خدمة التوصيل رقم #1 في القصرين 📍
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Uh Gina Delivery <br />
              <span className="text-indigo-300">نقضيو شورك ونوصلولك لباب دارك! 🛒📦</span>
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 max-w-xl mx-auto md:mr-0 leading-relaxed">
              ما تعبش روحك! وجبات، قضية الدار، أدوية، مستندات عاجلة، أو أي حاجة تستحقها.. اطلب وحنا نتكفلو بالباقي بسرعة وثقة.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 pt-2">
              <Link
                to="/login"
                className="px-6 py-3.5 rounded-xl bg-white text-indigo-900 font-bold shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-0.5 text-base"
              >
                اطلب الآن 🛵
              </Link>
              <a
                href="tel:29146431"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-semibold border border-indigo-400/40 transition"
              >
                <PhoneIcon className="w-5 h-5 text-indigo-200" />
                <span>29 146 431</span>
              </a>
              <a
                href="https://wa.me/21629146431"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow transition"
              >
                <span>واتساب 💬</span>
              </a>
            </div>
          </div>

          <div className="w-48 sm:w-64 md:w-80 shrink-0">
            <img
              src={logo}
              alt="Uh Gina Delivery Logo"
              className="w-full h-auto rounded-3xl shadow-2xl border-4 border-indigo-400/30 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-4 py-14 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">شنوّة تحب نوصلولك اليوم؟</h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">خدماتنا تشمل كل ما تحتاجه في مدينة القصرين وضواحيها</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-right"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">كيفاش تطلب؟ 3 خطوات ساهلين</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-4xl mb-3">{st.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{st.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Contact Card */}
      <section className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden md:flex items-center">
          <div className="p-8 flex-1 text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              فريق موثوق في خدمتك
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mt-3">سريع، أمين، ودائماً على الموعد</h3>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              من أي نقطة في مدينة القصرين، نوفرولك خدمة توصيل احترافية مع احترام كامل لمواعيدك وسلامة أغراضك.
            </p>
            <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
              <a
                href="https://www.facebook.com/profile.php?id=61576288833815"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                فيسبوك Facebook →
              </a>
              <a
                href="https://www.instagram.com/uhgina_delivery/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition"
              >
                إنستغرام Instagram →
              </a>
            </div>
          </div>
          <div className="md:w-64 shrink-0 bg-gray-100 flex justify-center p-4">
            <img
              src={rayen}
              alt="Uh Gina Team"
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-xl shadow"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>© 2026 Uh Gina Delivery - القصرين، تونس | هاتف: 29 146 431</p>
      </footer>
    </div>
  );
}
