import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../public/logo.jpg';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'إدارة الطلبات (Commandes)', href: '/admin' },
    { name: 'المتاجر والسلع (Magasins)', href: '/admin/stores' },
    { name: 'السائقين (Livreurs)', href: '/admin/livreurs' },
    { name: 'الزبائن (Clients)', href: '/admin/clients' },
    { name: 'حسابي (Profil)', href: '/admin/profile' },
  ].map((item) => ({
    ...item,
    current: location.pathname.toLowerCase() === item.href.toLowerCase(),
  }));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Brand */}
          <Link to="/admin" className="flex items-center gap-2.5">
            <img src={logo} alt="Uh Gina" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <span className="text-white font-extrabold tracking-tight text-base sm:text-lg">
              Uh Gina <span className="text-amber-400 text-xs font-semibold">(لوحة الإدارة 👑)</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  'rounded-xl px-3.5 py-2 text-xs font-bold transition'
                )}
              >
                {item.name}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 rounded-xl px-3.5 py-2 text-xs font-bold transition ml-2 border border-rose-900/50"
            >
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <DisclosurePanel className="sm:hidden border-t border-gray-800 bg-gray-900">
        <div className="space-y-1 px-3 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                item.current
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                'block rounded-xl px-3 py-2 text-sm font-bold text-right'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}

          <DisclosureButton
            as="button"
            onClick={handleLogout}
            className="w-full text-right text-rose-400 hover:bg-rose-950/40 rounded-xl px-3 py-2 text-sm font-bold mt-2"
          >
            تسجيل الخروج (Déconnexion)
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
