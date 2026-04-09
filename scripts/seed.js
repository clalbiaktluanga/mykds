import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

await mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  name: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Clear existing users
await User.deleteMany({});

// Create users
await User.insertMany([
  {
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    name: 'Miss Ruth',
  },
  {
    username: 'teacher1',
    password: await bcrypt.hash('teacher123', 10),
    role: 'teacher',
    name: 'Miss Esther',
  },
  {
    username: 'teacher2',
    password: await bcrypt.hash('teacher123', 10),
    role: 'teacher',
    name: 'Sir Joseph',
  },
]);

console.log('✅ Users seeded!');
await mongoose.disconnect();