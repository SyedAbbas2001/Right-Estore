import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: {
    type: String,
    required: true,
    enum: ['garments', 'newborn', 'toys', 'stationery'],
  },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  images: [{ type: String }],
  description: { type: String },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  features: [{ type: String }],
  tags: [{ type: String }],
  ageGroup: { type: String },
  gender: { type: String, enum: ['Boys', 'Girls', 'Unisex'] },
  brand: { type: String },
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  badge: { type: String },
  badgeColor: { type: String },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
