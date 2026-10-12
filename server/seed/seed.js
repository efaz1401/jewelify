import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const categories = [
  {
    name: 'Studs',
    description: 'Classic stud earrings — timeless, elegant, everyday staples.',
    image: 'https://images.unsplash.com/photo-1535632066274-36f5c39b5652?w=1200&q=80',
  },
  {
    name: 'Hoops',
    description: 'From petite huggies to statement hoops — a must-have silhouette.',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1200&q=80',
  },
  {
    name: 'Drops',
    description: 'Graceful drop earrings that sway with every movement.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&q=80',
  },
  {
    name: 'Dangles',
    description: 'Bold dangle earrings for statement-making looks.',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80',
  },
  {
    name: 'Chandeliers',
    description: 'Ornate chandelier earrings for special occasions.',
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1200&q=80',
  },
  {
    name: 'Pearl',
    description: 'Timeless pearl earrings — classic elegance redefined.',
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=1200&q=80',
  },
];

const productsByCategory = {
  Studs: [
    {
      name: 'Solitaire Diamond Stud',
      description: 'A single round-brilliant cut lab-grown diamond set in 14k white gold. Everyday luxury at its finest.',
      price: 129.0,
      discountPercent: 10,
      material: 'diamond',
      style: 'stud',
      stock: 25,
      featured: true,
      images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&q=80'],
    },
    {
      name: 'Minimalist Gold Dot',
      description: 'Tiny 14k gold dot studs for a barely-there glow. Perfect for stacking.',
      price: 39.0,
      material: 'gold',
      style: 'stud',
      stock: 80,
      images: ['https://images.unsplash.com/photo-1633934542430-b0bb64bbd96a?w=1200&q=80'],
    },
    {
      name: 'Sapphire Classic Stud',
      description: 'Deep blue sapphire studs in 18k white gold bezel. A timeless pop of color.',
      price: 189.0,
      discountPercent: 15,
      material: 'gemstone',
      style: 'stud',
      stock: 18,
      images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&q=80'],
    },
  ],
  Hoops: [
    {
      name: 'Classic Gold Hoops',
      description: 'Polished 14k gold medium hoops. The one accessory you will reach for every day.',
      price: 79.0,
      material: 'gold',
      style: 'hoop',
      stock: 45,
      featured: true,
      images: ['https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=1200&q=80'],
    },
    {
      name: 'Diamond Huggie Hoops',
      description: 'Pavé-set diamond huggies that hug the earlobe with quiet sparkle.',
      price: 249.0,
      discountPercent: 20,
      material: 'diamond',
      style: 'huggie',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80'],
    },
    {
      name: 'Rose Gold Statement Hoops',
      description: 'Bold 40mm rose gold hoops for a warm, contemporary look.',
      price: 69.0,
      material: 'rose-gold',
      style: 'hoop',
      stock: 30,
      images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&q=80'],
    },
  ],
  Drops: [
    {
      name: 'Crystal Teardrop Drops',
      description: 'Faceted crystal teardrops on delicate gold chains. Light and luminous.',
      price: 59.0,
      discountPercent: 25,
      material: 'gemstone',
      style: 'drop',
      stock: 50,
      featured: true,
      images: ['https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?w=1200&q=80'],
    },
    {
      name: 'Freshwater Pearl Drops',
      description: 'Lustrous freshwater pearls suspended from 14k gold posts.',
      price: 89.0,
      material: 'pearl',
      style: 'drop',
      stock: 35,
      images: ['https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=1200&q=80'],
    },
  ],
  Dangles: [
    {
      name: 'Geometric Gold Dangles',
      description: 'Architectural gold dangles — modern lines, easy confidence.',
      price: 75.0,
      material: 'gold',
      style: 'dangle',
      stock: 22,
      images: ['https://images.unsplash.com/photo-1635767582909-345ea92b78ab?w=1200&q=80'],
    },
    {
      name: 'Emerald Long Dangles',
      description: 'Cascading emerald dangles set in 18k gold. Red-carpet ready.',
      price: 299.0,
      discountPercent: 30,
      material: 'gemstone',
      style: 'dangle',
      stock: 8,
      featured: true,
      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80'],
    },
  ],
  Chandeliers: [
    {
      name: 'Rose Gold Chandelier',
      description: 'Intricate chandelier earrings with cascading crystals on rose gold.',
      price: 219.0,
      discountPercent: 15,
      material: 'rose-gold',
      style: 'chandelier',
      stock: 10,
      images: ['https://images.unsplash.com/photo-1633810541988-5aee6c9cf99a?w=1200&q=80'],
    },
    {
      name: 'Silver Chandelier Drops',
      description: 'Sterling silver chandelier earrings with delicate filigree work.',
      price: 149.0,
      material: 'silver',
      style: 'chandelier',
      stock: 12,
      images: ['https://images.unsplash.com/photo-1624886136067-6f0b7b9ff4b1?w=1200&q=80'],
    },
  ],
  Pearl: [
    {
      name: 'Baroque Pearl Studs',
      description: 'Unique baroque freshwater pearls — no two pairs are alike.',
      price: 99.0,
      material: 'pearl',
      style: 'stud',
      stock: 28,
      featured: true,
      images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1200&q=80'],
    },
    {
      name: 'Pearl Threader Earrings',
      description: 'Delicate pearl threaders in 14k gold — effortless elegance.',
      price: 85.0,
      discountPercent: 10,
      material: 'pearl',
      style: 'threader',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1611591437268-6f26c59ae5e3?w=1200&q=80'],
    },
  ],
};

async function run() {
  await connectDB();

  const reset = process.argv.includes('--reset');
  if (reset) {
    console.log('Resetting collections...');
    await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);
  }

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@jewelify.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log(`Upgraded existing user ${adminEmail} to admin`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  // Categories
  const catMap = {};
  for (const c of categories) {
    const slug = slugify(c.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      catMap[c.name] = existing;
    } else {
      catMap[c.name] = await Category.create({ ...c, slug });
      console.log(`+ category: ${c.name}`);
    }
  }

  // Products
  for (const [catName, products] of Object.entries(productsByCategory)) {
    const cat = catMap[catName];
    for (const p of products) {
      const slug = slugify(p.name);
      const existing = await Product.findOne({ slug });
      if (existing) continue;
      await Product.create({ ...p, slug, category: cat._id });
      console.log(`  + product: ${p.name}`);
    }
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
