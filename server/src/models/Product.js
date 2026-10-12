import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 90 },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    material: { type: String, enum: ['gold', 'silver', 'rose-gold', 'platinum', 'pearl', 'diamond', 'gemstone', 'other'], default: 'other' },
    style: { type: String, enum: ['stud', 'hoop', 'drop', 'dangle', 'chandelier', 'huggie', 'threader', 'ear-cuff', 'other'], default: 'other' },
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual('finalPrice').get(function () {
  const discount = (this.price * this.discountPercent) / 100;
  return Math.round((this.price - discount) * 100) / 100;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
