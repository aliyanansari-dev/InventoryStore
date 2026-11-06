# Mini Mart Inventory & POS (Point of Sale) System

A complete, production-ready **Mini Mart Inventory & POS System** built from scratch with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB + Mongoose**, **NextAuth.js**, **Recharts**, and **Sonner**.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard (Bento-Box Layout)
- **4 Bento-Box Stat Cards**:
  - **Total Revenue (Today)**: Gross POS transaction volume.
  - **Total Products**: Active catalog SKU counter.
  - **Low Stock Alerts**: Highlights items below the low-stock threshold (`stock <= 10`).
  - **Total Sales (Today)**: Total customer orders completed today.
- **7-Day Sales Trend**: Interactive Recharts gradient area chart visualizing daily sales revenue and transaction count.
- **Recent Transactions**: Real-time log of the latest 5 orders with order ID, cashier name, item count, total, and direct receipt link.

### 2. 📦 Inventory Management (CRUD)
- **Data Table**: Columns for Product Image, Name, SKU / Barcode, Category, Cost Price, Selling Price, and Stock Status.
- **Search & Filters**: Instant search by item name or SKU, filter by category dropdown, and a quick toggle for **Low Stock Only**.
- **Visual Status Badges**:
  - 🟢 **In Stock** (`>= 10` units)
  - 🔴 **Low Stock** (`< 10` units)
  - ⚠️ **Out of Stock** (`0` units)
- **Add / Edit Modal**: Built with **React Hook Form + Zod** schema validation.
- **Delete Confirmation**: Protected modal with role enforcement (Admin only; Cashiers receive a view-only indicator).

### 3. 🛒 Point of Sale (POS) Billing Terminal
- **Split-Screen Design**:
  - **Left 70%**: Responsive product grid with category pills, live search, stock quantity indicators, and click-to-add action.
  - **Right 30%**: Sticky Checkout panel with live item quantities (`+` / `-` capped by available stock), subtotal, **5% tax**, and grand total.
- **Simulated Barcode Scanner**: Top input bar equipped with scan laser animation. Enter any valid SKU (e.g., `BEV-COCA-330`) or scan a barcode to immediately auto-add the item to the active cart with Sonner toast feedback.
- **Automated Stock Deduction**: Checkout automatically executes atomic stock decrement in MongoDB and updates the inventory in real time.
- **Printable Thermal Receipt**: Upon checkout, a thermal receipt modal opens automatically displaying store details, order number, timestamp, cashier name, itemized bill, tax breakdown, and a **Print Receipt** action (`window.print()`).

### 4. 🧾 Sales History & Side-Drawer Inspection
- Chronological table of all past transactions.
- Filter by Order ID, Cashier Name, or Payment Method.
- **Clickable Row Side-Drawer (Sheet)**: Slide-out drawer showing complete order audit trail, line items with SKU and unit prices, subtotal, tax, and reprint receipt button.

### 5. 👥 User & Staff Management (Admin Only)
- Secure administrator route guarded by NextAuth session and role check.
- Table of all store staff showing Name, Email, Role (Admin vs Cashier), and account creation date.
- Modal to provision new Cashier or Admin accounts with bcrypt password hashing.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Language**: TypeScript
- **Database**: MongoDB (`mongodb://localhost:27017/minimart`)
- **ORM**: Mongoose 8
- **Authentication**: NextAuth.js (Credentials Provider, JWT, Role-based sessions)
- **Styling**: Tailwind CSS, Glassmorphic UI, Custom Scrollbars
- **Charts**: Recharts
- **Forms & Validation**: React Hook Form, Zod, `@hookform/resolvers`
- **Notifications**: Sonner toasts (`toast.success`, `toast.error`)
- **Icons**: Lucide React

---

## 🔐 Default Credentials (Seed Data)

The included seed script populates the database with:
- **Admin**: `admin@minimart.com` / `admin123` (Full CRUD, User Management, Analytics)
- **Cashier**: `cashier@minimart.com` / `cashier123` (POS Billing, Inventory View)
- **3 Categories**: Beverages, Snacks, Household
- **25 Grocery Products**: Real grocery items with SKUs, prices, stock counts, and low-stock alerts.
- **7 Days of Historical Orders**: Sample sales for immediate chart visualization.

> **Tip**: On the Login page (`/login`), click **"Fill Admin"** or **"Fill Cashier"** to auto-populate credentials with one click!

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **MongoDB**: Local MongoDB instance running at `mongodb://localhost:27017` (e.g., via MongoDB Community Server or Docker: `docker run -d -p 27017:27017 --name mongo mongo:latest`).

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Ensure `MONGODB_URI` points to your local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/minimart
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super_secret_minimart_jwt_token_key_change_me_in_prod_2026
```

### 4. Seed the Database
Populate users, categories, 25 products, and 7-day sales records:
```bash
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be redirected to the `/login` screen.

---

## 📂 Project Structure

```
├── app
│   ├── (auth)
│   │   └── login
│   │       └── page.tsx           # Split-screen glassmorphic login
│   ├── (dashboard)
│   │   ├── dashboard
│   │   │   └── page.tsx           # Bento-box dashboard + Recharts
│   │   ├── inventory
│   │   │   └── page.tsx           # CRUD Inventory management
│   │   ├── pos
│   │   │   └── page.tsx           # 70/30 Split POS Billing Terminal
│   │   ├── sales
│   │   │   └── page.tsx           # Sales table & slide-out receipt drawer
│   │   ├── users
│   │   │   └── page.tsx           # Admin staff management
│   │   └── layout.tsx             # Protected Dashboard layout
│   ├── api
│   │   └── auth/[...nextauth]     # NextAuth route handler
│   ├── globals.css                # Glassmorphism, custom scrollbar & theme
│   ├── layout.tsx                 # Root layout with fonts & providers
│   └── page.tsx                   # Auth router
├── components
│   ├── dashboard                  # StatCard, SalesChart, RecentSalesTable
│   ├── inventory                  # InventoryTable, ProductDialog, DeleteDialog
│   ├── pos                        # PosInterface, ProductGrid, CartPanel, BarcodeScanner, ReceiptModal
│   ├── sales                      # SalesTable, Receipt Sheet
│   ├── shared                     # Sidebar, Header, Providers, ThemeProvider
│   ├── ui                         # Button, Input, Table, Dialog, Sheet, Badge, Card, Select, Sonner
│   └── users                      # UsersTable, AddStaffDialog
├── lib
│   ├── actions                    # Next.js Server Actions (order, product, category, dashboard, user)
│   ├── auth.ts                    # NextAuth credentials & JWT callbacks
│   ├── db.ts                      # Cached Mongoose connection
│   └── utils.ts                   # Currency/date formatters, order generator
├── models                         # Mongoose schemas (User, Category, Product, Order)
├── scripts
│   └── seed.ts                    # Database seeding script (25 items, 2 users, sample orders)
├── types
│   └── next-auth.d.ts             # Extended NextAuth session & token types
└── package.json
```

---

## 📜 License
MIT License. Built for modern retail commerce.
