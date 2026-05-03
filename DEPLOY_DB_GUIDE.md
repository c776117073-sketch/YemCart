# 📊 استخدام ملفات Deploy للقاعدة

## 📌 نظرة عامة

هناك طريقتان لنشر قاعدة البيانات:

### الطريقة الأولى ✅ **الموصى بها**
```
1. انسخ schema.sql يدوياً
2. الصقه في Supabase SQL Editor
3. اضغط Run
4. تم!
```

### الطريقة الثانية 🔄 **البديلة**
```
استخدام deploy-db-verify.js للتحقق بعد النشر
أو استخدام deploy-db.js لمحاولة النشر من الكود
```

---

## 🚀 الخطوات التفصيلية

### للطريقة الأولى (الموصى بها):

#### الخطوة 1: افتح SQL Editor
```
1. اذهب إلى https://app.supabase.com
2. اختر مشروعك
3. اذهب إلى "SQL Editor" من الجانب الأيسر
```

#### الخطوة 2: انسخ schema.sql
```bash
# انسخ المحتوى من ملف schema.sql
cat schema.sql | pbcopy  # على Mac
# أو الصقه يدوياً من المحرر
```

#### الخطوة 3: الصق و شغّل
```
1. اضغط "New Query" في SQL Editor
2. الصق المحتوى
3. اضغط الزر الأخضر "Run"
4. انتظر النتائج
```

#### الخطوة 4: تحقق
```bash
node deploy-db-verify.js
```

إذا رأيت:
```
✅ Table 'users' exists
✅ Table 'stores' exists
...
✨ Database setup completed successfully!
```

فأنت بخير! 🎉

---

## ⚙️ للطريقة الثانية (استخدام deploy-db.js):

### المتطلبات:
```bash
npm install @supabase/supabase-js dotenv
```

### الاستخدام:
```bash
node deploy-db.js
```

### الآلية:
```
1. يقرأ .env.local
2. يتصل بـ Supabase
3. يقسّم schema.sql إلى جمل
4. ينفذ كل جملة
5. يطبع النتائج
```

### الإخراج المتوقع:
```
🚀 YemCart Database Deployment
================================

📖 Reading schema.sql...
✅ Schema.sql read successfully (12345 bytes)

🔍 Parsing SQL statements...
✅ Found 15 SQL statements

⚙️  Executing statements...

[1/15] CREATE EXTENSION...
❌ Statement 1 failed: extension already exists

[2/15] CREATE TABLE users...
✅ Statement 2 executed

...

✨ Database deployment completed successfully!
```

---

## 🆘 استكشاف الأخطاء الشائعة

### خطأ 1: "Missing environment variables"
```
❌ Error: Missing environment variables!
Make sure your .env.local file contains:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
```

**الحل:**
```bash
# تأكد من وجود .env.local
ls -la .env.local

# أضف المتغيرات الناقصة
echo "NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co" >> .env.local
```

---

### خطأ 2: "Extension already exists"
```
❌ CREATE EXTENSION "uuid-ossp" failed: extension already exists
```

**الحل:** هذا خطأ غير حرج، تجاهله!

---

### خطأ 3: "Permission denied"
```
❌ INSERT INTO shipping_zones failed: permission denied
```

**الحل:**
1. تحقق من أن `SUPABASE_SERVICE_ROLE_KEY` صحيح
2. تأكد من تفعيل RLS بشكل صحيح

---

### خطأ 4: "Connection refused"
```
❌ Fatal error: connect ECONNREFUSED
```

**الحل:**
1. تحقق من `NEXT_PUBLIC_SUPABASE_URL`
2. تأكد من وجود إنترنت
3. تحقق من حالة Supabase من https://status.supabase.com

---

## 🔄 إعادة المحاولة

إذا حدث خطأ:

### الخيار 1: حاول مرة أخرى
```bash
node deploy-db-verify.js
# إذا أظهر أن بعض الجداول موجودة، فقد نجح البعض
```

### الخيار 2: حذف وأعد المحاولة
```bash
# تحذير: هذا سيحذف جميع البيانات!
# افتح SQL Editor في Supabase وشغّل:
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shipping_zones CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

ثم شغّل deploy-db.js مرة أخرى.

---

## ✅ بعد النشر الناجح

```bash
# 1. تحقق من الجداول
npm run db:verify

# 2. تثبيت المتطلبات
npm install

# 3. شغّل المشروع
npm run dev

# 4. اختبر الاتصال بـ Supabase
# افتح http://localhost:3000 في المتصفح
```

---

## 📋 سجل عمليات النشر

### تاريخ النشر
```
📅 2026-04-30
✅ Schema: Complete
✅ Policies: Enabled
✅ Indexes: Created
✅ Default Zones: Inserted
```

---

## 🎯 الخطوات التالية

بعد نشر قاعدة البيانات بنجاح:

1. ✅ انتقل إلى المرحلة 2: نظام المصادقة
   - صفحة تسجيل الدخول
   - صفحة التسجيل
   - التحقق من OTP الهاتف

2. ✅ انتقل إلى المرحلة 3: لوحة تحكم البائع
   - إدارة المنتجات
   - إدارة الطلبات
   - إعدادات المتجر

3. ✅ انتقل إلى المرحلة 4: واجهة العميل
   - الصفحة الرئيسية
   - سلة المشتريات
   - الشراء

4. ✅ انتقل إلى المرحلة 5: المميزات المتقدمة
   - المحادثة الفورية
   - تكامل WhatsApp
   - تحسين الصور

---

## 📞 للمساعدة والاستيضاح

إذا واجهت مشكلة تقنية:

1. تحقق من [DATABASE_SETUP.md](./DATABASE_SETUP.md)
2. اقرأ رسالة الخطأ بعناية
3. جرب الحلول المذكورة أعلاه
4. تحقق من حالة Supabase

Good luck! 🚀