import { useState } from "react";
import { modifyUser } from "../axios/authApi";
import { useToast } from "../context/ToastContext";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function LivreurProfile() {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [newPassword, setNewPassword] = useState("");
  const [vNewPassword, setVNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== vNewPassword) {
      showToast("كلمتا المرور غير متطابقتين!", "error");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await modifyUser(user.role, user.id, {
        name,
        phoneNumber,
        adress: user?.adress || "",
        password: newPassword,
        verifPassword: vNewPassword,
      });

      if (updatedUser?.data?.user) {
        localStorage.setItem("user", JSON.stringify(updatedUser.data.user));
        setUser(updatedUser.data.user);
        setNewPassword("");
        setVNewPassword("");
        showToast("تم تحديث بياناتك بنجاح! ✅", "success");
      }
    } catch (err) {
      showToast("حدث خطأ أثناء تعديل الحساب، يرجى المحاولة لاحقاً.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-gray-100 text-right">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCircleIcon className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">ملف السائق الشخصي</h1>
            <p className="text-xs text-gray-500 mt-1">تعديل بيانات الحساب وكلمة المرور</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="Name" className="block text-xs font-bold text-gray-700 mb-1">
                الاسم (Nom)
              </label>
              <input
                id="Name"
                name="Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-xs font-bold text-gray-700 mb-1">
                رقم الهاتف (Téléphone)
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 mb-3 text-center">لتغيير كلمة المرور (اختياري)</p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="new_password" className="block text-xs font-bold text-gray-700 mb-1">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    placeholder="اتركه فارغاً إذا لم ترغب بتغييرها"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>

                <div>
                  <label htmlFor="v_new_password" className="block text-xs font-bold text-gray-700 mb-1">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    id="v_new_password"
                    name="v_new_password"
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    value={vNewPassword}
                    onChange={(e) => setVNewPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-2.5 text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50"
              >
                {loading ? "جاري الحفظ..." : "حفظ التعديلات ✅"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
