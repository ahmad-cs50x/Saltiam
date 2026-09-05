import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number },
  availability: { type: String, default: 'In Stock' },
  itemsSold: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
