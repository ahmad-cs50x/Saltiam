import mongoose, { Document, InferSchemaType } from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String },
  category: { type: String },
  tags: [String],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export type BlogType = InferSchemaType<typeof blogSchema> & Document;

const BlogModel = (mongoose.models.Blog || mongoose.model('Blog', blogSchema)) as mongoose.Model<BlogType>;

export default BlogModel;
