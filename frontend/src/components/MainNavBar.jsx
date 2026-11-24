import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../public/logo.jpg';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function MainNavBar() {
  const location = useLocation();

  const navigation = [
    { name: 'الرئيسية (Accueil)', href: '/' },
    { name: 'تسجيل الدخول (Connexion)', href: '/login' },
    { name: 'حساب جديد (Inscription)', href: '/registre' },
  ].map(item => ({
    ...item,
    current: location.pathname === item.href,
  }));

  return (
    <Disclosure as="nav" className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Uh Gina" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <span className="text-white font-extrabold tracking-tight text-lg">Uh Gina Delivery</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden sm:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  'rounded-xl px-3.5 py-2 text-xs font-bold transition'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
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

      {/* Mobile nav panel */}
      <DisclosurePanel className="sm:hidden border-t border-gray-800 bg-gray-900">
        <div className="space-y-1 px-3 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className={classNames(
                item.current
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                'block rounded-xl px-3 py-2 text-sm font-bold text-right'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
