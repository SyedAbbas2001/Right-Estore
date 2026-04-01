import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  avatar: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  comment: { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: String, required: true, enum: ['garments', 'newborn', 'toys', 'stationery'] },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  images: [{ type: String }],
  description: { type: String, default: '' },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  features: [{ type: String }],
  tags: [{ type: String }],
  ageGroup: { type: String, default: '' },
  gender: { type: String, enum: ['Boys', 'Girls', 'Unisex'], default: 'Unisex' },
  brand: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  badge: { type: String, default: '' },
  badgeColor: { type: String, default: 'bg-candy-pink' },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  reviews: [ReviewSchema],
}, { timestamps: true });

ProductSchema.virtual('rating').get(function () {
  if (!this.reviews.length) return 0;
  const sum = this.reviews.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

ProductSchema.virtual('reviewCount').get(function () {
  return this.reviews.length;
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
