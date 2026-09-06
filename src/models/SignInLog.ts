import mongoose, { Document, InferSchemaType } from 'mongoose';

const signInLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  provider: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export type SignInLogType = InferSchemaType<typeof signInLogSchema> & Document;

const SignInLogModel = (mongoose.models.SignInLog || mongoose.model('SignInLog', signInLogSchema)) as mongoose.Model<SignInLogType>;

export default SignInLogModel;
