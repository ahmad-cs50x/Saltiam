import mongoose from 'mongoose';

const signInLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  provider: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.SignInLog || mongoose.model('SignInLog', signInLogSchema);
