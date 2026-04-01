import connectDB from './db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const categories = [
  { name: 'Garments', slug: 'garments', description: 'Adorable clothes for little ones', emoji: '👗', color: 'from-pink-400 to-rose-400', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=400&fit=crop' },
  { name: 'New Born', slug: 'newborn', description: 'Gentle essentials for newborns', emoji: '👶', color: 'from-blue-400 to-cyan-400', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop' },
  { name: 'Toys', slug: 'toys', description: 'Fun toys to spark imagination', emoji: '🧸', color: 'from-yellow-400 to-amber-400', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop' },
  { name: 'Stationery', slug: 'stationery', description: 'Creative tools for young minds', emoji: '✏️', color: 'from-purple-400 to-violet-400', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop' },
];

export async function seedDatabase() {
  await connectDB();

  // Admin user
  const adminExists = await User.findOne({ email: 'admin@rightestore.pk' });
  if (!adminExists) {
    await User.create({
      name: 'Admin User',
      email: 'admin@rightestore.pk',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@rightestore.pk / admin123');
  }

  // Categories
  for (const cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (!exists) {
      await Category.create(cat);
      console.log('✅ Category created:', cat.name);
    }
  }

  console.log('🌱 Database seeded successfully!');
}
