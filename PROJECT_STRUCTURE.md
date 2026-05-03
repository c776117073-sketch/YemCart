# 🗂️ YemCart Project Structure & File Descriptions

## 📂 الملفات والمجلدات الرئيسية

### في الجذر (Root)

#### `schema.sql` ⭐
```
📄 قاعدة البيانات الكاملة
- تعريف 8 جداول رئيسية
- تفعيل RLS على جميع الجداول
- سياسات أمان دقيقة (RLS Policies)
- فهارس لتحسين الأداء
- مدارات (Constraints) وفحوصات (Checks)

💡 كيفية الاستخدام:
1. انسخ محتوى الملف
2. اذهب إلى Supabase Dashboard
3. اذهب إلى SQL Editor
4. الصق الكود وشغّله (Run)
```

#### `middleware.ts`
```
🔀 توجيه النطاقات الفرعية
- يكتشف النطاقات الفرعية (مثل store.yemcart.com)
- يحول الطلبات إلى المسارات الصحيحة
- يدير جلسات المستخدمين
- يعيد تحديث رموز الجلسات

📍 المسارات:
- store.yemcart.com → /store/store
- dashboard.yemcart.com → /dashboard
- admin.yemcart.com → /admin
```

#### `deploy-db-verify.js`
```
✅ سكريبت التحقق من قاعدة البيانات
- يتحقق من وجود جميع الجداول
- ينشئ مناطق شحن افتراضية
- يختبر الاتصال بـ Supabase
- يطبع رسائل تقدم مفصلة

🚀 الاستخدام:
   node deploy-db-verify.js
```

#### `deploy-db.js`
```
📊 سكريبت نشر قاعدة البيانات (بديل)
- يقرأ محتوى schema.sql
- ينفذ جميع جمل SQL
- يتعامل مع الأخطاء بذكاء

⚠️ ملاحظة: الطريقة الموصى بها هي نسخ schema.sql مباشرة إلى SQL Editor
```

#### `package.json`
```
📦 قائمة المتطلبات والسكريبتات
- جميع المكتبات المطلوبة
- أوامر npm للتطوير والبناء
- إصدارات Node.js المدعومة

🔧 الأوامر الرئيسية:
   npm run dev → تشغيل الخادم
   npm run build → بناء المشروع
   npm run db:verify → التحقق من قاعدة البيانات
```

#### `tsconfig.json`
```
🧬 إعدادات TypeScript
- Strict mode مفعّل
- الأنواع المخصصة
- مسارات الاستيراد
```

#### `tailwind.config.ts`
```
🎨 إعدادات Tailwind CSS
- ألوان YemCart المخصصة
- دعم RTL كامل
- خطوط عربية
```

#### `next.config.js`
```
⚙️ إعدادات Next.js
- تحسين الصور
- رؤوس الأمان
- تكوين القطاع
```

#### `.env.local.example`
```
🔐 مثال على متغيرات البيئة
- نسخ إلى .env.local
- أضف قيمك الخاصة
```

#### `.gitignore`
```
🚫 الملفات التي يتم تجاهلها
- node_modules
- .env
- ملفات المحرر
```

#### `DATABASE_SETUP.md`
```
📖 دليل إعداد قاعدة البيانات الكامل
- خطوات التثبيت
- استكشاف الأخطاء
```

#### `README.md`
```
📚 ملف القراءة الرئيسي
- معلومات المشروع
- البدء السريع
```

---

## 🗂️ المجلدات (After Setup)

### `lib/`
```
📚 مكتبات ومساعدات
├── supabase.ts
│   ├── createClient() → عميل الجانب العميل
│   ├── createServerSupabaseClient() → عميل الخادم
│   └── Database Type → أنواع TypeScript
└── hooks/
    ├── useAuth.ts → إدارة المصادقة
    ├── useStore.ts → معلومات المتجر الحالي
    └── useCart.ts → إدارة السلة (Zustand)
```

### `app/`
```
🌐 تطبيق Next.js (App Router)
├── layout.tsx → التخطيط الرئيسي
├── page.tsx → الصفحة الرئيسية
├── auth/
│   ├── login/ → صفحة تسجيل الدخول
│   ├── register/ → صفحة التسجيل
│   └── callback/ → الاتصال الآمن من Supabase
├── dashboard/
│   ├── layout.tsx → تخطيط لوحة التحكم
│   ├── page.tsx → لوحة المقياس
│   ├── products/ → إدارة المنتجات
│   ├── orders/ → إدارة الطلبات
│   ├── settings/ → إعدادات المتجر
│   └── shipping/ → إدارة الشحن
└── store/[slug]/
    ├── page.tsx → الصفحة الرئيسية للمتجر
    ├── product/[id]/ → صفحة المنتج
    ├── cart/ → سلة المشتريات
    └── checkout/ → إتمام الشراء
```

### `components/`
```
⚛️ مكونات React المعاد استخدامها
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── ... مكونات Shadcn UI
├── forms/
│   ├── LoginForm.tsx
│   ├── AddProductForm.tsx
│   └── CheckoutForm.tsx
├── store/
│   ├── ProductCard.tsx
│   ├── StoreBanner.tsx
│   ├── Cart.tsx
│   └── ChatBox.tsx
└── dashboard/
    ├── Sidebar.tsx
    ├── OrderList.tsx
    └── ProductTable.tsx
```

### `styles/`
```
🎨 ملفات CSS
├── globals.css → الأنماط العامة
├── variables.css → متغيرات الألوان
└── rtl.css → تنسيقات RTL المخصصة
```

### `public/`
```
📸 الملفات الثابتة
├── logo.svg
├── favicon.ico
├── icons/
└── images/
```

---

## 📋 قائمة التحقق الكاملة (Checklist)

```
قبل الإطلاق (Before Launch):
☐ نشر schema.sql في Supabase
☐ التحقق من قاعدة البيانات: npm run db:verify
☐ إعداد .env.local بالقيم الصحيحة
☐ تثبيت المتطلبات: npm install
☐ اختبار المصادقة
☐ اختبار إنشاء المتجر
☐ اختبار إضافة المنتجات
☐ اختبار السلة والشراء
☐ اختبار المحادثة المباشرة
☐ اختبار تحسين الصور
☐ اختبار الأداء على إنترنت بطيء
☐ اختبارات الأمان
☐ الامتثال للقوانين المحلية
```

---

## 🔗 الملفات المرتبطة

```
.env.local ← يجب أن تحتوي على:
  ├── NEXT_PUBLIC_SUPABASE_URL
  ├── NEXT_PUBLIC_SUPABASE_ANON_KEY
  └── SUPABASE_SERVICE_ROLE_KEY (فقط على الخادم)

schema.sql ← ينشئ:
  ├── users
  ├── stores
  ├── products
  ├── product_images
  ├── orders
  ├── order_items
  ├── shipping_zones
  └── messages

lib/supabase.ts ← يستخدم:
  ├── NEXT_PUBLIC_SUPABASE_URL
  ├── NEXT_PUBLIC_SUPABASE_ANON_KEY
  └── SUPABASE_SERVICE_ROLE_KEY (SSR فقط)
```

---

## 🎯 التطور المستقبلي

المزيد من الملفات ستضاف في:
- ✅ المرحلة 2: نظام المصادقة
- ✅ المرحلة 3: لوحة تحكم البائع
- ✅ المرحلة 4: واجهة العميل
- ✅ المرحلة 5: المميزات المتقدمة

---

## 📞 للمساعدة

إذا احتجت إلى معلومات عن ملف معين:
```bash
# اقرأ التعليقات في الملف
head -50 middleware.ts

# أو ابحث عن وظيفة معينة
grep -n "function" lib/supabase.ts
```