import mongoose, { Document, InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['normal', 'super'], default: 'normal' },
  deliveryLocation: {
    country: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    address: { type: String, default: '' },
    updatedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

export type UserType = InferSchemaType<typeof userSchema> & Document;

const UserModel = (mongoose.models.User || mongoose.model('User', userSchema)) as mongoose.Model<UserType>;

export default UserModel;
