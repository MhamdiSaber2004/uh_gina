import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LivreurNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'All Commandes', href: '/livreur' },
    { name: 'Profile', href: '/livreur/profile' },
  ].map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }));

  const handleLogout = () => {
    localStorage.removeItem('livreurToken'); // ← تأكد أن هذا هو اسم التوكن
    navigate('/'); // ← الرجوع للصفحة الرئيسية
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <Fragment>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 flex justify-center">
            <div className="relative flex h-16 items-center justify-center w-full">
              {/* زر الموبايل */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* روابط سطح المكتب */}
              <div className="flex flex-1 justify-center items-center">
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {/* زر Logout */}
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* قائمة الموبايل */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}

              {/* زر Logout للموبايل */}
              <DisclosureButton
                as="button"
                onClick={handleLogout}
                className="block text-left w-full text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
              >
                Logout
              </DisclosureButton>
            </div>
          </DisclosurePanel>
        </Fragment>
      )}
    </Disclosure>
  );
}
