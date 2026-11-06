import bcrypt from "bcryptjs";

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "cashier";
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCategory {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProduct {
  _id: string;
  name: string;
  sku: string;
  categoryId: any;
  price: number;
  costPrice: number;
  stock: number;
  image: string;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockOrderItem {
  productId: any;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface MockOrder {
  _id: string;
  orderNumber: string;
  cashierId: any;
  items: MockOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card" | "digital";
  status: "completed" | "refunded" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface StoreState {
  users: MockUser[];
  categories: MockCategory[];
  products: MockProduct[];
  orders: MockOrder[];
  initialized: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __miniMartStore: StoreState | undefined;
}

function initStore(): StoreState {
  if (globalThis.__miniMartStore && globalThis.__miniMartStore.initialized) {
    return globalThis.__miniMartStore;
  }

  const now = new Date();

  // 1. Initial Users
  const adminPasswordHash = bcrypt.hashSync("admin123", 10);
  const cashierPasswordHash = bcrypt.hashSync("cashier123", 10);

  const adminUser: MockUser = {
    _id: "654321000000000000000001",
    name: "Alex Administrator",
    email: "admin@minimart.com",
    passwordHash: adminPasswordHash,
    role: "admin",
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
  };

  const cashierUser: MockUser = {
    _id: "654321000000000000000002",
    name: "Sarah Cashier",
    email: "cashier@minimart.com",
    passwordHash: cashierPasswordHash,
    role: "cashier",
    createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
  };

  // 2. Initial Categories
  const catBeverages: MockCategory = {
    _id: "654321000000000000000011",
    name: "Beverages",
    description: "Refreshing drinks, sodas, juices, tea, coffee, and packaged mineral water",
    createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
  };

  const catSnacks: MockCategory = {
    _id: "654321000000000000000012",
    name: "Snacks",
    description: "Crisps, biscuits, chocolates, candies, crackers, and sweet bakery treats",
    createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
  };

  const catHousehold: MockCategory = {
    _id: "654321000000000000000013",
    name: "Household",
    description: "Cleaning liquids, laundry soaps, detergents, paper towels, and home care items",
    createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
  };

  const categories = [catBeverages, catSnacks, catHousehold];

  // 3. Initial Products
  const rawProducts = [
    {
      _id: "654321000000000000000101",
      name: "Coca-Cola Original 330ml Can",
      sku: "BEV-COCA-330",
      categoryId: catBeverages._id,
      costPrice: 0.75,
      price: 1.5,
      stock: 45,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000102",
      name: "Pepsi Max 330ml Can",
      sku: "BEV-PEPS-330",
      categoryId: catBeverages._id,
      costPrice: 0.7,
      price: 1.45,
      stock: 32,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000103",
      name: "Red Bull Energy Drink 250ml",
      sku: "BEV-REDB-250",
      categoryId: catBeverages._id,
      costPrice: 1.6,
      price: 2.99,
      stock: 6,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000104",
      name: "Evian Natural Mineral Water 1L",
      sku: "BEV-EVIA-100",
      categoryId: catBeverages._id,
      costPrice: 0.9,
      price: 1.95,
      stock: 50,
      lowStockThreshold: 15,
      image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000105",
      name: "Tropicana Pure Orange Juice 500ml",
      sku: "BEV-TROP-500",
      categoryId: catBeverages._id,
      costPrice: 1.4,
      price: 2.75,
      stock: 8,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000106",
      name: "Arizona Green Tea Ginseng 500ml",
      sku: "BEV-ARIZ-500",
      categoryId: catBeverages._id,
      costPrice: 1.1,
      price: 2.2,
      stock: 24,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000107",
      name: "Monster Energy Ultra White 500ml",
      sku: "BEV-MONS-500",
      categoryId: catBeverages._id,
      costPrice: 1.7,
      price: 3.25,
      stock: 15,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000108",
      name: "San Pellegrino Sparkling Water 750ml",
      sku: "BEV-SANP-750",
      categoryId: catBeverages._id,
      costPrice: 1.3,
      price: 2.6,
      stock: 4,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000109",
      name: "Lay's Classic Salted Potato Chips 150g",
      sku: "SNK-LAYS-150",
      categoryId: catSnacks._id,
      costPrice: 1.2,
      price: 2.49,
      stock: 38,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000110",
      name: "Doritos Nacho Cheese Tortilla Chips 170g",
      sku: "SNK-DORI-170",
      categoryId: catSnacks._id,
      costPrice: 1.45,
      price: 2.99,
      stock: 22,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000111",
      name: "Pringles Sour Cream & Onion 165g",
      sku: "SNK-PRIN-165",
      categoryId: catSnacks._id,
      costPrice: 1.8,
      price: 3.49,
      stock: 5,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000112",
      name: "Oreo Original Sandwich Cookies 154g",
      sku: "SNK-OREO-154",
      categoryId: catSnacks._id,
      costPrice: 0.95,
      price: 1.99,
      stock: 40,
      lowStockThreshold: 12,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000113",
      name: "KitKat 4 Finger Milk Chocolate 41.5g",
      sku: "SNK-KITK-041",
      categoryId: catSnacks._id,
      costPrice: 0.6,
      price: 1.25,
      stock: 60,
      lowStockThreshold: 15,
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000114",
      name: "Snickers Peanut Butter Bar 48g",
      sku: "SNK-SNIK-048",
      categoryId: catSnacks._id,
      costPrice: 0.65,
      price: 1.35,
      stock: 7,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000115",
      name: "Haribo Goldbears Gummy Candy 100g",
      sku: "SNK-HARI-100",
      categoryId: catSnacks._id,
      costPrice: 0.85,
      price: 1.85,
      stock: 28,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000116",
      name: "M&M's Peanut Chocolate Candies 100g",
      sku: "SNK-MMPE-100",
      categoryId: catSnacks._id,
      costPrice: 1.1,
      price: 2.3,
      stock: 3,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000117",
      name: "Nature Valley Oats & Honey Bars 5-Pack",
      sku: "SNK-NATV-210",
      categoryId: catSnacks._id,
      costPrice: 2.1,
      price: 4.19,
      stock: 19,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000118",
      name: "Dove Deep Moisture Body Wash 500ml",
      sku: "HOU-DOVE-500",
      categoryId: catHousehold._id,
      costPrice: 3.5,
      price: 6.99,
      stock: 14,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000119",
      name: "Colgate Total Clean Mint Toothpaste 100ml",
      sku: "HOU-COLG-100",
      categoryId: catHousehold._id,
      costPrice: 1.5,
      price: 3.2,
      stock: 35,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000120",
      name: "Dettol Antibacterial Liquid Handwash 250ml",
      sku: "HOU-DETT-250",
      categoryId: catHousehold._id,
      costPrice: 1.8,
      price: 3.75,
      stock: 8,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000121",
      name: "Fairy Original Washing Up Liquid 433ml",
      sku: "HOU-FAIR-433",
      categoryId: catHousehold._id,
      costPrice: 1.4,
      price: 2.89,
      stock: 26,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000122",
      name: "Ariel All-in-1 Pods Laundry Detergent 15s",
      sku: "HOU-ARIE-015",
      categoryId: catHousehold._id,
      costPrice: 4.8,
      price: 8.99,
      stock: 7,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000123",
      name: "Kleenex Ultra Soft Facial Tissues 80s",
      sku: "HOU-KLEE-080",
      categoryId: catHousehold._id,
      costPrice: 1.2,
      price: 2.5,
      stock: 42,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000124",
      name: "Glade Automatic Spray Refill Lavender 269ml",
      sku: "HOU-GLAD-269",
      categoryId: catHousehold._id,
      costPrice: 2.9,
      price: 5.49,
      stock: 9,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&auto=format&fit=crop&q=80",
    },
    {
      _id: "654321000000000000000125",
      name: "Flash Multi-Surface Cleaning Spray 500ml",
      sku: "HOU-FLAS-500",
      categoryId: catHousehold._id,
      costPrice: 1.9,
      price: 3.99,
      stock: 18,
      lowStockThreshold: 10,
      image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const products: MockProduct[] = rawProducts.map((p, i) => ({
    ...p,
    createdAt: new Date(now.getTime() - (25 - i) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - (25 - i) * 24 * 60 * 60 * 1000),
  }));

  // 4. Initial Sample Orders (7 days)
  const orders: MockOrder[] = [];
  for (let i = 6; i >= 0; i--) {
    const orderDate = new Date(now);
    orderDate.setDate(now.getDate() - i);
    orderDate.setHours(9 + (i % 8), 15 + ((i * 7) % 45), 0, 0);

    const ordersPerDay = i === 0 ? 4 : 2 + (i % 3);
    for (let j = 0; j < ordersPerDay; j++) {
      const p1 = products[(i * 3 + j) % products.length];
      const p2 = products[(i * 3 + j + 5) % products.length];

      const item1Qty = 1 + (j % 3);
      const item2Qty = 1 + ((j + 1) % 2);
      const item1Total = Math.round(p1.price * item1Qty * 100) / 100;
      const item2Total = Math.round(p2.price * item2Qty * 100) / 100;

      const subtotal = Math.round((item1Total + item2Total) * 100) / 100;
      const tax = Math.round(subtotal * 0.05 * 100) / 100;
      const total = Math.round((subtotal + tax) * 100) / 100;

      const orderItemDate = new Date(orderDate);
      orderItemDate.setHours(orderDate.getHours() + j * 2);

      orders.push({
        _id: `65432100000000000000${(2000 + orders.length).toString(16).padStart(4, "0")}`,
        orderNumber: `ORD-${orderItemDate.getFullYear()}${String(orderItemDate.getMonth() + 1).padStart(2, "0")}${String(orderItemDate.getDate()).padStart(2, "0")}-${String(orders.length + 1001).padStart(4, "0")}`,
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

  const state: StoreState = {
    users: [adminUser, cashierUser],
    categories,
    products,
    orders,
    initialized: true,
  };

  globalThis.__miniMartStore = state;
  return state;
}

export function getStore(): StoreState {
  return initStore();
}

function generateId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const random = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(16, "0");
  return timestamp + random;
}

// Chainable query builder helper
class MockQuery<T> {
  private data: Promise<T[]>;
  private populatedFields: { path: string; select?: string }[] = [];
  private sortFn: ((a: any, b: any) => number) | null = null;
  private limitCount: number | null = null;

  constructor(initialData: T[] | Promise<T[]>) {
    this.data = Promise.resolve(initialData);
  }

  populate(path: string, select?: string) {
    this.populatedFields.push({ path, select });
    return this;
  }

  sort(criteria: Record<string, 1 | -1>) {
    const keys = Object.keys(criteria);
    if (keys.length > 0) {
      const key = keys[0];
      const direction = criteria[key];
      this.sortFn = (a, b) => {
        const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
        const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
        if (valA < valB) return direction === 1 ? -1 : 1;
        if (valA > valB) return direction === 1 ? 1 : -1;
        return 0;
      };
    }
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  lean() {
    return this.execute();
  }

  then<TResult1 = T[], TResult2 = never>(
    onfulfilled?: ((value: T[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<T[]> {
    let items = await this.data;
    // deep clone items to prevent accidental external mutation
    items = JSON.parse(JSON.stringify(items));

    if (this.sortFn) {
      items.sort(this.sortFn);
    }

    if (this.limitCount !== null && this.limitCount >= 0) {
      items = items.slice(0, this.limitCount);
    }

    // Apply populates
    const store = getStore();
    for (const pop of this.populatedFields) {
      for (const item of items as any[]) {
        if (pop.path === "categoryId") {
          const cat = store.categories.find((c) => String(c._id) === String(item.categoryId));
          if (cat) {
            item.categoryId = { _id: cat._id, name: cat.name };
          }
        } else if (pop.path === "cashierId") {
          const user = store.users.find((u) => String(u._id) === String(item.cashierId));
          if (user) {
            item.cashierId = {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } else if (pop.path === "items.productId" && Array.isArray(item.items)) {
          for (const it of item.items) {
            const p = store.products.find((prod) => String(prod._id) === String(it.productId));
            if (p) {
              it.productId = {
                _id: p._id,
                name: p.name,
                sku: p.sku,
                image: p.image,
                price: p.price,
              };
            }
          }
        }
      }
    }

    return items;
  }
}

// Single item query builder helper
class MockSingleQuery<T> {
  private dataPromise: Promise<T | null>;
  private populatedFields: { path: string; select?: string }[] = [];

  constructor(initialItem: T | null | Promise<T | null>) {
    this.dataPromise = Promise.resolve(initialItem);
  }

  populate(path: string, select?: string) {
    this.populatedFields.push({ path, select });
    return this;
  }

  lean() {
    return this.execute();
  }

  then<TResult1 = T | null, TResult2 = never>(
    onfulfilled?: ((value: T | null) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<T | null> {
    const raw = await this.dataPromise;
    if (!raw) return null;
    const item = JSON.parse(JSON.stringify(raw)) as any;

    const store = getStore();
    for (const pop of this.populatedFields) {
      if (pop.path === "categoryId") {
        const cat = store.categories.find((c) => String(c._id) === String(item.categoryId));
        if (cat) {
          item.categoryId = { _id: cat._id, name: cat.name };
        }
      } else if (pop.path === "cashierId") {
        const user = store.users.find((u) => String(u._id) === String(item.cashierId));
        if (user) {
          item.cashierId = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      } else if (pop.path === "items.productId" && Array.isArray(item.items)) {
        for (const it of item.items) {
          const p = store.products.find((prod) => String(prod._id) === String(it.productId));
          if (p) {
            it.productId = {
              _id: p._id,
              name: p.name,
              sku: p.sku,
              image: p.image,
              price: p.price,
            };
          }
        }
      }
    }

    return item;
  }
}

// In-Memory Model Emulators
export const MockUserModel = {
  async findOne(query: any): Promise<any> {
    const store = getStore();
    let user: MockUser | undefined;

    if (query.email) {
      const email = typeof query.email === "string" ? query.email.toLowerCase().trim() : "";
      user = store.users.find((u) => u.email.toLowerCase() === email);
    } else if (query._id) {
      user = store.users.find((u) => String(u._id) === String(query._id));
    }

    return user ? JSON.parse(JSON.stringify(user)) : null;
  },

  find(query: any = {}, projection?: string) {
    const store = getStore();
    let users = [...store.users];

    if (projection === "-passwordHash") {
      users = users.map((u) => {
        const { passwordHash, ...rest } = u;
        return rest as any;
      });
    }

    return new MockQuery(users);
  },

  async create(data: { name: string; email: string; passwordHash: string; role: "admin" | "cashier" }) {
    const store = getStore();
    const newUser: MockUser = {
      _id: generateId(),
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.users.unshift(newUser);
    return JSON.parse(JSON.stringify(newUser));
  },
};

export const MockCategoryModel = {
  find(query: any = {}) {
    const store = getStore();
    return new MockQuery(store.categories);
  },

  async findOne(query: any) {
    const store = getStore();
    if (query.name) {
      const name = String(query.name).trim().toLowerCase();
      const cat = store.categories.find((c) => c.name.toLowerCase() === name);
      return cat ? JSON.parse(JSON.stringify(cat)) : null;
    }
    return null;
  },

  async create(data: { name: string; description?: string }) {
    const store = getStore();
    const newCat: MockCategory = {
      _id: generateId(),
      name: data.name.trim(),
      description: data.description?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.categories.push(newCat);
    return JSON.parse(JSON.stringify(newCat));
  },
};

export const MockProductModel = {
  async countDocuments(filter: any = {}) {
    const store = getStore();
    if (filter?.$expr?.$lte) {
      return store.products.filter((p) => p.stock <= (p.lowStockThreshold ?? 10)).length;
    }
    return store.products.length;
  },

  find(filter: any = {}) {
    const store = getStore();
    let list = [...store.products];

    if (filter?.$or && Array.isArray(filter.$or)) {
      list = list.filter((p) => {
        return filter.$or.some((condition: any) => {
          if (condition.name && condition.name instanceof RegExp) {
            return condition.name.test(p.name);
          }
          if (condition.sku && condition.sku instanceof RegExp) {
            return condition.sku.test(p.sku);
          }
          return false;
        });
      });
    }

    if (filter?.categoryId && filter.categoryId !== "all") {
      list = list.filter((p) => String(p.categoryId) === String(filter.categoryId));
    }

    if (filter?.$expr?.$lte) {
      list = list.filter((p) => p.stock <= (p.lowStockThreshold ?? 10));
    }

    return new MockQuery(list);
  },

  findOne(filter: any = {}) {
    const store = getStore();
    let product: MockProduct | undefined;

    if (filter?.sku) {
      if (filter.sku?.$regex) {
        const regex = filter.sku.$regex instanceof RegExp ? filter.sku.$regex : new RegExp(filter.sku.$regex, "i");
        product = store.products.find((p) => regex.test(p.sku));
      } else {
        const sku = String(filter.sku).toUpperCase().trim();
        product = store.products.find((p) => {
          const match = p.sku.toUpperCase() === sku;
          if (filter._id?.$ne) {
            return match && String(p._id) !== String(filter._id.$ne);
          }
          return match;
        });
      }
    }

    return new MockSingleQuery(product || null);
  },

  async findById(id: string) {
    const store = getStore();
    const p = store.products.find((prod) => String(prod._id) === String(id));
    return p ? JSON.parse(JSON.stringify(p)) : null;
  },

  async create(data: any) {
    const store = getStore();
    const newProduct: MockProduct = {
      _id: generateId(),
      name: data.name.trim(),
      sku: data.sku.trim().toUpperCase(),
      categoryId: data.categoryId,
      price: Number(data.price),
      costPrice: Number(data.costPrice),
      stock: Number(data.stock),
      image: data.image?.trim() || "",
      lowStockThreshold: data.lowStockThreshold ? Number(data.lowStockThreshold) : 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.products.unshift(newProduct);
    return JSON.parse(JSON.stringify(newProduct));
  },

  async findByIdAndUpdate(id: string, update: any, options?: any) {
    const store = getStore();
    const idx = store.products.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) return null;

    const current = store.products[idx];
    if (update?.$inc?.stock) {
      current.stock = Math.max(0, current.stock + Number(update.$inc.stock));
    }

    if (update.name !== undefined) current.name = update.name.trim();
    if (update.sku !== undefined) current.sku = update.sku.trim().toUpperCase();
    if (update.categoryId !== undefined) current.categoryId = update.categoryId;
    if (update.price !== undefined) current.price = Number(update.price);
    if (update.costPrice !== undefined) current.costPrice = Number(update.costPrice);
    if (update.stock !== undefined && !update.$inc) current.stock = Number(update.stock);
    if (update.image !== undefined) current.image = update.image.trim();
    if (update.lowStockThreshold !== undefined) current.lowStockThreshold = Number(update.lowStockThreshold);
    current.updatedAt = new Date();

    return JSON.parse(JSON.stringify(current));
  },

  async findByIdAndDelete(id: string) {
    const store = getStore();
    const idx = store.products.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) return null;
    const [deleted] = store.products.splice(idx, 1);
    return JSON.parse(JSON.stringify(deleted));
  },
};

export const MockOrderModel = {
  find(filter: any = {}) {
    const store = getStore();
    let orders = [...store.orders];

    if (filter?.status) {
      orders = orders.filter((o) => o.status === filter.status);
    }

    if (filter?.createdAt) {
      const gte = filter.createdAt.$gte ? new Date(filter.createdAt.$gte).getTime() : 0;
      const lte = filter.createdAt.$lte ? new Date(filter.createdAt.$lte).getTime() : Infinity;
      orders = orders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= gte && t <= lte;
      });
    }

    return new MockQuery(orders);
  },

  findById(id: string) {
    const store = getStore();
    const order = store.orders.find((o) => String(o._id) === String(id));
    return new MockSingleQuery(order || null);
  },

  async create(data: any) {
    const store = getStore();
    const newOrder: MockOrder = {
      _id: generateId(),
      orderNumber: data.orderNumber,
      cashierId: data.cashierId,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      paymentMethod: data.paymentMethod || "cash",
      status: data.status || "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.orders.unshift(newOrder);
    return JSON.parse(JSON.stringify(newOrder));
  },
};
