import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  address: String,
  city: String,
  province: String,
  postalCode: String,
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  addresses: [AddressSchema],
  wishlist: [{ type: String }], // product IDs
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

// Don't return password in queries
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
