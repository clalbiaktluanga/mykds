// scripts/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

await mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
  username: String, password: String, role: String, name: String,
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Only reset the admin — don't touch teachers with assigned classes
await User.findOneAndUpdate(
  { username: 'admin' },
  {
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    name: 'Principal Roy',
  },
  { upsert: true }
);

console.log('✅ Admin password reset!');
await mongoose.disconnect();