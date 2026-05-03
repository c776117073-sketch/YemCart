# 🚀 YemCart - Multi-Vendor E-Commerce Platform
## Production-Ready Setup & Deployment Guide

---

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Local Development](#local-development)
4. [Features](#features)
5. [Deployment](#deployment)
6. [Project Structure](#project-structure)

---

## 🔧 Initial Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd YemCart
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Firebase Configuration
See [Firebase Configuration](#firebase-configuration) section below.

---

## 🔥 Firebase Configuration

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `yemcart`
4. Enable Google Analytics (optional)
5. Click **"Create Project"**

### Step 2: Create Web App
1. In Firebase Console, click the **"Web"** icon
2. Enter app nickname: `YemCart Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Copy the Firebase config

### Step 3: Set Up Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
   - Provider: Email/Password
   - Enable **Email link sign-in** (optional)
3. Enable **Google**
   - Click **Google**
   - Select **Internal** or **External**
   - Add test users if needed
4. Add your domain to **Authorized domains**

### Step 4: Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create Database"**
3. Select region (close to users): `middle-east (saudi arabia)`
4. Start in **Production mode**
5. Click **"Create"**
6. Go to **Rules** tab and replace with rules from `FIRESTORE_RULES.txt`
7. Click **"Publish"**

### Step 5: Set Up Storage
1. Go to **Storage**
2. Click **"Get Started"**
3. Start in **Production mode**
4. Select region: `middle-east (saudi arabia)`
5. Click **"Done"**

### Update Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase config values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
```

---

## 💻 Local Development

### Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

### Run Type Check
```bash
npm run type-check
```

---

## ✨ Features Implemented

### 🔐 Authentication
- ✅ Email & Password signup/login
- ✅ Google Sign-in
- ✅ Email verification (mandatory)
- ✅ Persistent login session
- ✅ User roles (buyer/seller)

### 👤 User Profile
- ✅ Profile editing
- ✅ Avatar upload
- ✅ Cover image upload
- ✅ Bio/description
- ✅ Phone number

### 🏪 Store System (Seller)
- ✅ Public store page
- ✅ Store profile with cover & avatar
- ✅ Product listings by seller
- ✅ Seller dashboard

### 📦 Product Management
- ✅ Add product (sellers)
- ✅ Edit product (sellers)
- ✅ Delete product (sellers)
- ✅ Product listing
- ✅ Product details page
- ✅ Multiple product images
- ✅ Search functionality

### 🛒 Cart System
- ✅ Add to cart
- ✅ Remove from cart
- ✅ Update quantity
- ✅ Local storage persistence
- ✅ Cart total calculation

### ❤️ Favorites System
- ✅ Add to favorites
- ✅ Remove from favorites
- ✅ View favorites page
- ✅ Favorites persistence

### 📱 UI/UX
- ✅ Mobile-first design
- ✅ RTL (Arabic) support
- ✅ Dark theme (Red & Black)
- ✅ Bottom navigation bar
- ✅ Responsive grid layouts
- ✅ Loading states
- ✅ Toast notifications
- ✅ Error handling (Arabic messages)

---

## 🚀 Deployment

### Option 1: Deploy on Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial YemCart commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository
   - Select the project

3. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add all Firebase config variables:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment to complete
   - Your site is now live!

### Option 2: Deploy on Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Initialize Firebase**
```bash
firebase init hosting
```

3. **Build the project**
```bash
npm run build
```

4. **Deploy**
```bash
firebase deploy --only hosting
```

### Option 3: Deploy on Any Node.js Host

1. **Build the project**
```bash
npm run build
```

2. **Upload to your server**
   - Upload all files except `node_modules/`, `.next/`, `.git/`
   - Run `npm install` on the server
   - Run `npm start`

3. **Use a process manager like PM2**
```bash
npm install -g pm2
pm2 start npm --name "yemcart" -- start
pm2 startup
pm2 save
```

---

## 📁 Project Structure

```
YemCart/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with RTL & AuthProvider
│   ├── page.tsx                 # Homepage
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── verify-email/
│   │   └── page.tsx            # Email verification
│   ├── search/
│   │   └── page.tsx            # Product search
│   ├── cart/
│   │   └── page.tsx            # Shopping cart
│   ├── product/
│   │   └── [id]/page.tsx       # Product details
│   ├── store/
│   │   └── [id]/page.tsx       # Seller store page
│   ├── profile/
│   │   ├── page.tsx            # User profile
│   │   └── edit/page.tsx       # Edit profile
│   ├── favorites/
│   │   └── page.tsx            # Favorites list
│   └── dashboard/
│       ├── page.tsx            # Seller dashboard
│       └── add-product/page.tsx # Add product
│
├── components/                   # Reusable components
│   ├── Header.tsx              # Navigation header
│   ├── BottomNav.tsx           # Mobile bottom navigation
│   ├── ProductCard.tsx         # Product card component
│   ├── Loaders.tsx             # Loading spinners
│
├── lib/                         # Business logic
│   ├── firebase.ts             # Firebase configuration
│   ├── auth.ts                 # Authentication functions
│   ├── db.ts                   # Firestore operations
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth context provider
│   ├── stores/
│   │   └── cartStore.ts        # Zustand cart store
│   └── hooks/
│       ├── useAuth.ts          # Auth hooks
│       └── useFavorites.ts     # Favorites hooks
│
├── app/
│   └── globals.css             # Global styles (Tailwind)
│
├── public/                      # Static assets
│
├── .env.local                   # Environment variables (Firebase config)
├── .env.local.example          # Example environment file
├── FIRESTORE_RULES.txt         # Firestore security rules
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript config
```

---

## 🔐 Security Features

### Firestore Rules
- Users can only edit their own data
- Products are readable by everyone
- Only authenticated users can create products
- Only sellers can modify/delete their own products
- Favorites are private per user

### Authentication
- Email verification required
- Password strength validation
- Session persistence
- Google OAuth integration

---

## 🎨 Customization

### Colors
Edit Tailwind colors in styles or use these custom colors:
- Primary: `bg-red-600`
- Dark Background: `bg-[#040202]`
- Card Background: `bg-[#1a0a0a]`

### Add Custom Domain
1. In Vercel/Firebase, go to Settings
2. Add your custom domain
3. Update DNS records
4. Wait for SSL certificate (usually instant)

### Multilingual Support
The app is currently in Arabic (RTL). To add English:
1. Create i18n configuration
2. Add language switcher
3. Translate all strings

---

## 📚 Database Schema

### Users Collection
```json
{
  "email": "user@example.com",
  "username": "username",
  "role": "buyer|seller",
  "phone": "+967XXXXXXXXX",
  "bio": "User bio",
  "avatar": "https://...",
  "coverImage": "https://...",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Products Collection
```json
{
  "title": "Product name",
  "description": "Product description",
  "price": 500,
  "images": ["https://...", "https://..."],
  "sellerId": "user-uid",
  "sellerUsername": "seller-name",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Favorites Collection
```json
{
  "userId": "user-uid",
  "productId": "product-id",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🆘 Troubleshooting

### Firebase Config Not Working
- Verify all environment variables are set correctly
- Check Firebase project exists
- Ensure Firestore database is created
- Check authentication providers are enabled

### Images Not Uploading
- Check Firebase Storage bucket exists
- Verify storage rules allow uploads
- Check file size limits (Firebase: 5GB per file)

### Authentication Issues
- Verify email verification is enabled
- Check authorized domains in Firebase
- Ensure Google OAuth credentials are correct

### Deployment Issues
- Check all environment variables are set on hosting platform
- Verify Next.js build succeeds locally
- Check Node.js version compatibility (>=18)

---

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase documentation
3. Check Next.js documentation
4. Create an issue in the repository

---

## 📄 License

YemCart - Multi-Vendor E-Commerce Platform
© 2024 All rights reserved.

---

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order management system
- [ ] Seller ratings & reviews
- [ ] Messaging between buyers and sellers
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Inventory management
- [ ] Coupon system
- [ ] Multi-language support (English, Arabic)
- [ ] Push notifications
- [ ] Video product listings
- [ ] Live chat support

---

**Happy Selling! 🚀**
