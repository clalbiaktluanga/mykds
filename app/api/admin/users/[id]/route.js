import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  await connectDB();
  const { name, username, password, role, assignedClasses } = await req.json();
  const update = { name, username, role, assignedClasses: assignedClasses || [] };
  if (password) update.password = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(params.id, update, { new: true })
    .select('-password').populate('assignedClasses');
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
  return Response.json(user);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}