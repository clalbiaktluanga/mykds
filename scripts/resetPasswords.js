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
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId }],
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// List all users first
const users = await User.find({}, 'username name role');
console.log('Current users in DB:');
users.forEach(u => console.log(` - ${u.username} (${u.name}) [${u.role}]`));

// Reset ALL user passwords to a known value
const newPassword = 'pass123';
const hashed = await bcrypt.hash(newPassword, 10);

await User.updateMany({}, { password: hashed });

console.log(`\n✅ All passwords reset to: "${newPassword}"`);
console.log('Users can now login with their username and password: pass123');

await mongoose.disconnect();