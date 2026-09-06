import mongoose, { Document, InferSchemaType } from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export type ReviewType = InferSchemaType<typeof reviewSchema> & Document;

const ReviewModel = (mongoose.models.Review || mongoose.model('Review', reviewSchema)) as mongoose.Model<ReviewType>;

export default ReviewModel;
