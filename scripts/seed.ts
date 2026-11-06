import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/minimart";

// Define schemas inline or import to avoid module resolution quirks in tsx standalone execution
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "cashier"], required: true },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, default: "" },
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        sku: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    paymentMethod: { type: String, default: "cash" },
    status: { type: String, default: "completed" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function seed() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log("Clearing existing collections...");
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});

  console.log("Seeding Users...");
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const cashierPasswordHash = await bcrypt.hash("cashier123", 10);

  const adminUser = await User.create({
    name: "Alex Administrator",
    email: "admin@minimart.com",
    passwordHash: adminPasswordHash,
    role: "admin",
  });

  const cashierUser = await User.create({
    name: "Sarah Cashier",
    email: "cashier@minimart.com",
    passwordHash: cashierPasswordHash,
    role: "cashier",
  });

  console.log(`Created 2 users:`);
  console.log(`- Admin: admin@minimart.com / admin123`);
  console.log(`- Cashier: cashier@minimart.com / cashier123`);

  console.log("Seeding Categories...");
  const beveragesCategory = await Category.create({
    name: "Beverages",
    description: "Refreshing drinks, sodas, juices, tea, coffee, and packaged mineral water",
  });

  const snacksCategory = await Category.create({
    name: "Snacks",
    description: "Crisps, biscuits, chocolates, candies, crackers, and sweet bakery treats",
  });

  const householdCategory = await Category.create({
    name: "Household",
    description: "Cleaning liquids, laundry soaps, detergents, paper towels, and home care items",
  });

  console.log("Seeding 25 Products with realistic SKUs and stock levels...");

  const rawProducts = [
    // --- Beverages (8 products) ---
    {
      name: "Coca-Cola Original 330ml Can",
      sku: "BEV-COCA-330",
      categoryId: beveragesCategory._id,
      costPrice: 0.75,
      price: 1.5,
      stock: 45,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Pepsi Max 330ml Can",
      sku: "BEV-PEPS-330",
      categoryId: beveragesCategory._id,
      costPrice: 0.7,
      price: 1.45,
      stock: 32,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Red Bull Energy Drink 250ml",
      sku: "BEV-REDB-250",
      categoryId: beveragesCategory._id,
      costPrice: 1.6,
      price: 2.99,
      stock: 6, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Evian Natural Mineral Water 1L",
      sku: "BEV-EVIA-100",
      categoryId: beveragesCategory._id,
      costPrice: 0.9,
      price: 1.95,
      stock: 50,
      lowStockThreshold: 15,
      image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Tropicana Pure Orange Juice 500ml",
      sku: "BEV-TROP-500",
      categoryId: beveragesCategory._id,
      costPrice: 1.4,
      price: 2.75,
      stock: 8, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Arizona Green Tea Ginseng 500ml",
      sku: "BEV-ARIZ-500",
      categoryId: beveragesCategory._id,
      costPrice: 1.1,
      price: 2.2,
      stock: 24,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Monster Energy Ultra White 500ml",
      sku: "BEV-MONS-500",
      categoryId: beveragesCategory._id,
      costPrice: 1.7,
      price: 3.25,
      stock: 15,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "San Pellegrino Sparkling Water 750ml",
      sku: "BEV-SANP-750",
      categoryId: beveragesCategory._id,
      costPrice: 1.3,
      price: 2.6,
      stock: 4, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&auto=format&fit=crop&q=80",
    },

    // --- Snacks (9 products) ---
    {
      name: "Lay's Classic Salted Potato Chips 150g",
      sku: "SNK-LAYS-150",
      categoryId: snacksCategory._id,
      costPrice: 1.2,
      price: 2.49,
      stock: 38,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Doritos Nacho Cheese Tortilla Chips 170g",
      sku: "SNK-DORI-170",
      categoryId: snacksCategory._id,
      costPrice: 1.45,
      price: 2.99,
      stock: 22,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Pringles Sour Cream & Onion 165g",
      sku: "SNK-PRIN-165",
      categoryId: snacksCategory._id,
      costPrice: 1.8,
      price: 3.49,
      stock: 5, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Oreo Original Sandwich Cookies 154g",
      sku: "SNK-OREO-154",
      categoryId: snacksCategory._id,
      costPrice: 0.95,
      price: 1.99,
      stock: 40,
      lowStockThreshold: 12,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "KitKat 4 Finger Milk Chocolate 41.5g",
      sku: "SNK-KITK-041",
      categoryId: snacksCategory._id,
      costPrice: 0.6,
      price: 1.25,
      stock: 60,
      lowStockThreshold: 15,
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Snickers Peanut Butter Bar 48g",
      sku: "SNK-SNIK-048",
      categoryId: snacksCategory._id,
      costPrice: 0.65,
      price: 1.35,
      stock: 7, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Haribo Goldbears Gummy Candy 100g",
      sku: "SNK-HARI-100",
      categoryId: snacksCategory._id,
      costPrice: 0.85,
      price: 1.85,
      stock: 28,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "M&M's Peanut Chocolate Candies 100g",
      sku: "SNK-MMPE-100",
      categoryId: snacksCategory._id,
      costPrice: 1.1,
      price: 2.3,
      stock: 3, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Nature Valley Oats & Honey Bars 5-Pack",
      sku: "SNK-NATV-210",
      categoryId: snacksCategory._id,
      costPrice: 2.1,
      price: 4.19,
      stock: 19,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format&fit=crop&q=80",
    },

    // --- Household (8 products) ---
    {
      name: "Dove Deep Moisture Body Wash 500ml",
      sku: "HOU-DOVE-500",
      categoryId: householdCategory._id,
      costPrice: 3.5,
      price: 6.99,
      stock: 14,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Colgate Total Clean Mint Toothpaste 100ml",
      sku: "HOU-COLG-100",
      categoryId: householdCategory._id,
      costPrice: 1.5,
      price: 3.2,
      stock: 35,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Dettol Antibacterial Liquid Handwash 250ml",
      sku: "HOU-DETT-250",
      categoryId: householdCategory._id,
      costPrice: 1.8,
      price: 3.75,
      stock: 8, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Fairy Original Washing Up Liquid 433ml",
      sku: "HOU-FAIR-433",
      categoryId: householdCategory._id,
      costPrice: 1.4,
      price: 2.89,
      stock: 26,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Ariel All-in-1 Pods Laundry Detergent 15s",
      sku: "HOU-ARIE-015",
      categoryId: householdCategory._id,
      costPrice: 4.8,
      price: 8.99,
      stock: 7, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Kleenex Ultra Soft Facial Tissues 80s",
      sku: "HOU-KLEE-080",
      categoryId: householdCategory._id,
      costPrice: 1.2,
      price: 2.5,
      stock: 42,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Glade Automatic Spray Refill Lavender 269ml",
      sku: "HOU-GLAD-269",
      categoryId: householdCategory._id,
      costPrice: 2.9,
      price: 5.49,
      stock: 9, // Low Stock Alert (<10)
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Flash Multi-Surface Cleaning Spray 500ml",
      sku: "HOU-FLAS-500",
      categoryId: householdCategory._id,
      costPrice: 1.9,
      price: 3.99,
      stock: 18,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const createdProducts = await Product.insertMany(rawProducts);
  console.log(`Successfully created ${createdProducts.length} products.`);

  // Create some initial sample orders for 7-day dashboard charts and recent sales
  console.log("Seeding sample orders for 7-day sales analytics...");
  const now = new Date();
  const sampleOrders = [];

  // Generate 7 days of realistic sales data
  for (let i = 6; i >= 0; i--) {
    const orderDate = new Date(now);
    orderDate.setDate(now.getDate() - i);
    orderDate.setHours(9 + (i % 8), 15 + (i * 7) % 45, 0, 0);

    // 2 to 4 orders per day
    const ordersPerDay = i === 0 ? 4 : 2 + (i % 3);
    for (let j = 0; j < ordersPerDay; j++) {
      const p1 = createdProducts[(i * 3 + j) % createdProducts.length];
      const p2 = createdProducts[(i * 3 + j + 5) % createdProducts.length];

      const item1Qty = 1 + (j % 3);
      const item2Qty = 1 + ((j + 1) % 2);
      const item1Total = Math.round(p1.price * item1Qty * 100) / 100;
      const item2Total = Math.round(p2.price * item2Qty * 100) / 100;

      const subtotal = Math.round((item1Total + item2Total) * 100) / 100;
      const tax = Math.round(subtotal * 0.05 * 100) / 100;
      const total = Math.round((subtotal + tax) * 100) / 100;

      const orderItemDate = new Date(orderDate);
      orderItemDate.setHours(orderDate.getHours() + j * 2);

      sampleOrders.push({
        orderNumber: `ORD-${orderItemDate.getFullYear()}${String(orderItemDate.getMonth() + 1).padStart(2, "0")}${String(orderItemDate.getDate()).padStart(2, "0")}-${String(sampleOrders.length + 1001).padStart(4, "0")}`,
        cashierId: j % 2 === 0 ? cashierUser._id : adminUser._id,
        items: [
          {
            productId: p1._id,
            name: p1.name,
            sku: p1.sku,
            quantity: item1Qty,
            price: p1.price,
            total: item1Total,
          },
          {
            productId: p2._id,
            name: p2.name,
            sku: p2.sku,
            quantity: item2Qty,
            price: p2.price,
            total: item2Total,
          },
        ],
        subtotal,
        tax,
        total,
        paymentMethod: j % 3 === 0 ? "cash" : j % 3 === 1 ? "card" : "digital",
        status: "completed",
        createdAt: orderItemDate,
        updatedAt: orderItemDate,
      });
    }
  }

  await Order.insertMany(sampleOrders);
  console.log(`Successfully created ${sampleOrders.length} sample orders for 7-day analytics!`);

  console.log("=========================================");
  console.log("🌱 Database Seeding Completed Successfully!");
  console.log("=========================================");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error during database seed:", err);
  process.exit(1);
});
