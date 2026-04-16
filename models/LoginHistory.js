import mongoose from 'mongoose';

const LoginHistorySchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  name:     { type: String },
  role:     { type: String },
  loginAt:  { type: Date, default: Date.now },
  changesCount: { type: Number, default: 0 },
}, { timestamps: false });

export default mongoose.models.LoginHistory ||
  mongoose.model('LoginHistory', LoginHistorySchema);