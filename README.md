# 🧸 Right Estore — Kids E-Commerce Platform

A fully featured, production-ready kids e-commerce website built with Next.js 15 App Router, featuring a playful pastel design, complete shopping flow, and admin dashboard.

---

## ✨ Features

### 🛍️ Customer Side
- **Homepage** — Hero banner slider, categories, featured products, testimonials, stats
- **Product Listing** — Filters (category, price, size, gender), sorting, grid/list view, infinite scroll
- **Product Detail** — Image gallery, size/color selector, reviews, related products
- **Cart** — Slide-out sidebar cart + full cart page, quantity control, free shipping indicator
- **Wishlist** — Save/remove items, add all to cart
- **Checkout** — Multi-step with COD + Stripe card payment
- **Order Confirmation** — Confetti animation, order tracking steps, coupon reward
- **Search** — Full-text search across products

### 👤 Authentication
- Login & Signup pages
- Form validation, password strength indicator
- Social login UI (Google, Facebook)

### 📊 User Dashboard
- Profile management (view/edit)
- Order history with status tracking
- Saved addresses
- Security (password change)

### 🛠️ Admin Panel (`/admin`)
- **Dashboard** — Sales stats, recent orders, top products, quick actions
- **Products** — Full CRUD (add, edit, delete), search & filter by category
- **Orders** — View all orders, filter by status, update order status in real-time
- **Categories** — Add/edit/delete categories with custom emoji & gradients
- **Analytics** — Revenue chart, category breakdown, KPIs

### ⚙️ Technical
- Next.js 15 App Router + Server Components
- Zustand for cart & wishlist state (persisted to localStorage)
- Tailwind CSS with custom design tokens
- Route groups for clean URL structure
- API Routes for products, orders, auth, reviews, Stripe
- Mongoose models (Product, Order, User)
- SEO: dynamic metadata, sitemap, robots.txt
- Loading skeletons, error boundaries, 404 page

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your values:
- `MONGODB_URI` — your MongoDB connection string
- `NEXTAUTH_SECRET` — random secret string
- `STRIPE_SECRET_KEY` — from [stripe.com](https://stripe.com) (test key)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
kids-store/
├── app/
│   ├── (auth)/          # Login, Signup pages (no navbar)
│   ├── (shop)/          # Products, Cart, Checkout, Wishlist
│   ├── (dashboard)/     # User Account, Orders
│   ├── (admin)/         # Full admin panel
│   ├── api/             # API routes (products, orders, auth, reviews, stripe)
│   ├── about/           # About page
│   ├── contact/         # Contact + FAQ page
│   ├── search/          # Search results
│   ├── layout.js        # Root layout with Navbar, Footer, CartSidebar
│   ├── page.js          # Homepage
│   ├── sitemap.js       # Auto-generated sitemap
│   └── robots.js        # robots.txt
│
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── home/            # HeroBanner, Categories, FeaturedProducts, etc.
│   ├── shop/            # ProductCard, ProductFilters
│   ├── cart/            # CartSidebar
│   ├── common/          # Skeletons
│   └── auth/            # (ready for auth components)
│
├── data/
│   └── products.js      # Sample product & category data (14 products, 4 categories)
│
├── store/
│   └── index.js         # Zustand stores: cart, wishlist, UI
│
├── lib/
│   ├── db.js            # MongoDB connection
│   └── models/          # Mongoose: Product, Order, User
│
├── hooks/
│   └── index.js         # Custom hooks: useSearch, useInView, useLocalStorage, etc.
│
└── utils/
    └── helpers.js       # Utility functions: formatPrice, slugify, cn, etc.
```

---

## 🎨 Design System

### Colors (Tailwind custom)
| Token | Value | Usage |
|-------|-------|-------|
| `candy-pink` | `#FF6B9D` | Primary CTAs, badges |
| `candy-purple` | `#C084FC` | Primary brand, links |
| `candy-yellow` | `#FCD34D` | Highlights, stars |
| `candy-blue` | `#60A5FA` | Info, shipping |
| `candy-green` | `#34D399` | Success, stock |

### Fonts
- **Display** — Bubblegum Sans (headings, prices, logo)
- **Body** — Nunito (all body text, labels)

### Components
- `.btn-primary` — gradient pink→purple, rounded-full
- `.btn-secondary` — white with purple border
- `.btn-outline` — gray border with hover
- `.card` — white rounded-3xl with soft shadow + hover
- `.input-field` — rounded-2xl with purple focus ring
- `.badge` — small rounded-full colored label

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rightestore.pk | admin123 |
| User | demo@rightestore.pk | password123 |

**Admin Panel:** [http://localhost:3000/admin-login](http://localhost:3000/admin-login)

---

## 💳 Payment Setup

### Stripe (Card Payments)
1. Create account at [stripe.com](https://stripe.com)
2. Copy test keys to `.env.local`
3. The `/api/orders/payment-intent` route creates PaymentIntents

### Cash on Delivery
Works out of the box — no setup needed.

---

## 🗄️ Database (MongoDB)

Without `MONGODB_URI`, the app uses the sample data in `data/products.js`.

To enable MongoDB:
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add connection string to `.env.local`
3. Mongoose models are in `lib/models/`

---

## 📦 Sample Data

14 products across 4 categories:
- **Garments** (5): Unicorn Dress, Dino T-Shirt, Star Hoodie, Princess Skirt, Superhero Cape
- **New Born** (3): Onesie Set, Bear Sleep Sack, Muslin Swaddles
- **Toys** (4): Rainbow Stacker, Mega Blocks, Plush Bunny, Kinetic Sand
- **Stationery** (2): Unicorn Art Set, Dino Backpack Set

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel — zero config for Next.js
```

### Environment Variables on Vercel
Add all variables from `.env.example` in your Vercel project settings.

---

## 📝 License

MIT — free to use for personal and commercial projects.

Built with ❤️ for little ones in Pakistan 🇵🇰
