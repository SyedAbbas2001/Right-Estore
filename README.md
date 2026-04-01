# 🧸 Right Estore — Kids E-Commerce Platform

A fully functional, production-ready kids e-commerce website built with Next.js 15 App Router.

---

## 🚀 Quick Setup (5 Steps)

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Environment Variables
```bash
cp .env.example .env.local
```
Then edit `.env.local`:

```env
# MongoDB Atlas (free at mongodb.com/atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rightestore

# JWT Secret (run: openssl rand -base64 32)
JWT_SECRET=your-random-secret-here-min-32-chars

# Cloudinary (free at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3 — Run Development Server
```bash
npm run dev
```

### Step 4 — Seed Database (First Time Only)
Open browser and go to:
```
POST http://localhost:3000/api/seed
Body: { "secret": "rightestore-seed-2024" }
```

Or use this curl command:
```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"rightestore-seed-2024"}'
```

This creates:
- ✅ Admin user: admin@rightestore.pk / admin123
- ✅ 4 default categories

### Step 5 — Login & Start Adding Products
- **Admin Panel:** http://localhost:3000/admin-login
- **Email:** admin@rightestore.pk
- **Password:** admin123

---

## 🔑 Quick Account Setup

### MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account → New Project → Build Database (M0 Free)
3. Create user & password
4. Network Access → Add `0.0.0.0/0`
5. Connect → Drivers → Copy connection string
6. Replace `<password>` with your password

### Cloudinary (Free)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Dashboard → Copy: Cloud Name, API Key, API Secret
4. Paste in `.env.local`

---

## ✅ Features

### Customer Side
- 🏠 Homepage with hero banner, categories, featured products
- 🛍️ Product listing with filters (category, price, size, gender)
- 📦 Product detail with image gallery, reviews
- 🛒 Cart with sidebar + full page
- ❤️ Wishlist
- 💳 Checkout (COD only)
- 🎉 Order confirmation
- 👤 User account (profile, orders, addresses)
- 🔍 Search

### Admin Panel (`/admin-login`)
- 📊 Dashboard with real-time stats
- ➕ Add/Edit/Delete products with **image upload to Cloudinary**
- 📋 View & manage orders, update status
- 🏷️ Add/Edit/Delete categories
- 📈 Analytics with charts

### Technical
- ✅ Real MongoDB database
- ✅ JWT authentication (login/signup)
- ✅ Cloudinary image upload
- ✅ bcrypt password hashing
- ✅ Protected admin routes
- ✅ Framer Motion animations
- ✅ Font Awesome icons
- ✅ Fully responsive

---

## 📁 Project Structure
```
app/
├── (auth)/         → Login, Signup
├── (shop)/         → Products, Cart, Checkout, Wishlist
├── (dashboard)/    → Account, Orders
├── (admin)/        → Admin Panel
├── api/
│   ├── auth/       → Login, Signup, Logout
│   ├── products/   → CRUD
│   ├── orders/     → Create, List, Update status
│   ├── categories/ → CRUD
│   ├── upload/     → Cloudinary image upload
│   ├── reviews/    → Add review
│   ├── seed/       → First-time DB setup
│   └── admin/analytics/ → Dashboard stats
lib/
├── db.js           → MongoDB connection
├── auth.js         → JWT utilities
├── cloudinary.js   → Image upload
└── models/         → User, Product, Order, Category
```

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add Environment Variables (same as `.env.local`)
4. Deploy!
5. Run seed: `POST your-domain.vercel.app/api/seed`

---

Built with ❤️ for little ones in Pakistan 🇵🇰
