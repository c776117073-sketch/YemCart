# 📊 YemCart Database Deployment Guide

## الخطوات الكاملة لنشر قاعدة البيانات

### الخطوة 1️⃣: إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع بالمحتوى التالي:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_MAIN_DOMAIN=yemcart.com
```

**كيفية الحصول على هذه المفاتيح:**
1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Settings > API**
4. ستجد:
   - `Project URL` = `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` = `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` = `SUPABASE_SERVICE_ROLE_KEY`

---

### الخطوة 2️⃣: نشر قاعدة البيانات

#### أفضل طريقة ✅ (موصى به):

1. افتح [Supabase Dashboard](https://app.supabase.com) → مشروعك
2. اذهب إلى **SQL Editor**
3. اضغط **"New Query"**
4. انسخ محتوى ملف `schema.sql` كاملاً
5. الصقه في محرر SQL
6. اضغط **"Run"** (الزر الأخضر)

> ⚠️ **ملاحظة:** يمكنك أن تقسّم الملف إذا كان كبيراً جداً وتشغله على دفعات.

---

### الخطوة 3️⃣: التحقق من نجاح النشر

بعد نشر `schema.sql`، شغّل سكريبت التحقق:

```bash
node deploy-db-verify.js
```

**النتيجة المتوقعة:**
```
🚀 YemCart Database Setup Verification
=====================================

✅ Successfully connected to Supabase
🔍 Verifying database schema...

✅ Table 'users' exists
✅ Table 'stores' exists
✅ Table 'products' exists
✅ Table 'product_images' exists
✅ Table 'shipping_zones' exists
✅ Table 'orders' exists
✅ Table 'order_items' exists
✅ Table 'messages' exists

📍 Setting up default shipping zones for Yemen...
✅ Added shipping zone: صنعاء (1000 ر.ي)
✅ Added shipping zone: عدن (1500 ر.ي)
...

✨ Database setup completed successfully!
```

---

### الخطوة 4️⃣: تثبيت المتطلبات

```bash
npm install @supabase/supabase-js dotenv
```

أو إذا كنت تستخدم yarn:

```bash
yarn add @supabase/supabase-js dotenv
```

---

## 📝 تفاصيل الملفات

### `schema.sql`
- يحتوي على تعريف جميع الجداول
- تفعيل RLS لكل جدول
- سياسات أمان دقيقة
- فهارس لتحسين الأداء

### `deploy-db-verify.js`
- يتحقق من وجود جميع الجداول
- ينشئ مناطق شحن افتراضية لليمن
- يطبع رسائل تقدم مفصلة

---

## ⚠️ استكشاف الأخطاء

### خطأ: "Missing environment variables"
- تأكد من وجود ملف `.env.local`
- تأكد من إدراج جميع المتغيرات الثلاثة

### خطأ: "Authentication failed"
- تحقق من صحة `SUPABASE_SERVICE_ROLE_KEY`
- تأكد من أنك في مشروع Supabase صحيح

### خطأ: "Table does not exist"
- نفذ `schema.sql` مرة أخرى في SQL Editor
- تأكد من عدم وجود أخطاء في SQL

### خطأ: "RLS policies not working"
- تأكد من تفعيل RLS من Settings > Auth > RLS
- تحقق من سياسات الأمان في Table > RLS

---

## 🔑 الخطوات التالية

بعد إكمال نشر قاعدة البيانات:

1. ✅ اختبر الاتصال بـ Supabase
2. ✅ تحقق من وجود جميع الجداول
3. ✅ انتقل إلى المرحلة الثانية: بناء نظام الأوثنتيكيشن

---

## 🆘 هل تحتاج مساعدة؟

إذا واجهت مشكلة:
1. تحقق من رسالة الخطأ بعناية
2. راجع الخطوات أعلاه
3. استخدم Supabase Dashboard للتحقق من الجداول يدوياً