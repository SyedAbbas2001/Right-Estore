import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';

const SEED_SECRET = process.env.SEED_SECRET || 'rightestore-seed-2024';

const defaultCategories = [
  { name: 'Garments', slug: 'garments', description: 'Adorable clothes for little ones', emoji: '👗', color: 'from-pink-400 to-rose-400', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=400&fit=crop' },
  { name: 'New Born', slug: 'newborn', description: 'Gentle essentials for newborns', emoji: '👶', color: 'from-blue-400 to-cyan-400', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop' },
  { name: 'Toys', slug: 'toys', description: 'Fun toys to spark imagination', emoji: '🧸', color: 'from-yellow-400 to-amber-400', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop' },
  { name: 'Stationery', slug: 'stationery', description: 'Creative tools for young minds', emoji: '✏️', color: 'from-purple-400 to-violet-400', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop' },
];

export async function POST(request) {
  try {
    const { secret } = await request.json();
    if (secret !== SEED_SECRET) return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });

    await connectDB();
    const results = [];

    // Admin user
    const adminExists = await User.findOne({ email: 'admin@rightestore.pk' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@rightestore.pk', password: 'admin123', role: 'admin' });
      results.push('✅ Admin created: admin@rightestore.pk / admin123');
    } else {
      results.push('⚠️ Admin already exists');
    }

    // Categories
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        results.push('✅ Category: ' + cat.name);
      } else {
        results.push('⚠️ Category exists: ' + cat.name);
      }
    }

    return NextResponse.json({ message: 'Seed complete!', results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
