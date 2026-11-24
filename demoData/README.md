# 📦 Demo Data - Uh Gina Delivery

ملفات البيانات التجريبية لتجربة واختبار النظام لجميع الأدوار (Admin, Livreur, Client).

---

## 👥 حسابات الدخول التجريبية (Demo Accounts):

كلمة المرور موحدة لجميع الحسابات: `password123`

| الدور (Role) | الاسم | رقم الهاتف (Login) | كلمة المرور | الصلاحيات |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Admin** | Admin Saber | `29146431` | `password123` | إدارة كل الطلبات، إضافة وتعيين طلبات، إدارة عمال التوصيل والزبائن |
| **🛵 Livreur 1** | Rayen Livreur | `22123456` | `password123` | استلام الطلبات، تغيير الحالة إلى `en livraison` و `livree` |
| **🛵 Livreur 2** | Ahmed Livreur | `55987654` | `password123` | استلام الطلبات وتوصيلها |
| **👤 Client 1** | Mohamed Ben Ali | `98112233` | `password123` | طلب توصيل، متابعة الطلبات الجارية والملغاة |
| **👤 Client 2** | Sarra Trabelsi | `44556677` | `password123` | طلب توصيل، متابعة طلبات قيد التوصيل |
| **👤 Client 3** | Fares Guesmi | `21334455` | `password123` | متابعة الطلبات المسلّمة |

---

## 📋 الطلبات التجريبية (Commandes):
* **قيد الانتظار (`encours`):** وجبة غداء كاملة من مطعم السلام (Mohamed Ben Ali).
* **قيد الانتظار (`encours`):** شاحن هاتف Type-C (Sarra Trabelsi).
* **قيد التوصيل (`enlivraison`):** أدوية وحليب رضع من صيدلية الليل (المكلف: Rayen Livreur).
* **تم التوصيل (`livree`):** وثائق قانونية عاجلة من المحكمة (المكلف: Ahmed Livreur).
* **ملغاة (`annulee`):** مشتريات خضار من سوق الجملة (ألغاها الآدمن).

---

## ⚡ كيفية إعادة حقن البيانات في أي وقت:
عبر تنفيذ الأمر التالي في موجه الأوامر:
```bash
docker exec uh_gina_backend node demoData/seed.js
```
