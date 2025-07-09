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

export default function ClientNavBar() {
  const location = useLocation();
  const navigate = useNavigate(); // ⬅️ مهم جداً للتنقل

  const navigation = [
    { name: 'All Commandes', href: '/client' },
    { name: 'Add Command', href: '/client/command' },
    { name: 'Profile', href: '/client/profile' },
  ].map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }));

  // ⬅️ وظيفة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('clientToken'); // أو localStorage.clear()
    navigate('/'); // ⬅️ الرجوع للصفحة الرئيسية
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <Fragment>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 flex justify-center">
            <div className="relative flex h-16 items-center justify-center w-full">

              {/* زر الموبايل */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                  <Bars3Icon className={`${open ? 'hidden' : 'block'} size-6`} />
                  <XMarkIcon className={`${open ? 'block' : 'hidden'} size-6`} />
                </DisclosureButton>
              </div>

              {/* روابط التصفح */}
              <div className="flex justify-center w-full">
                <div className="hidden sm:block">
                  <div className="flex justify-center space-x-4">
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

                    {/* زر Logout في سطح المكتب */}
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

          {/* القائمة في الموبايل */}
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

              {/* زر Logout في الموبايل */}
              <DisclosureButton
                as="button"
                onClick={handleLogout}
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium"
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
