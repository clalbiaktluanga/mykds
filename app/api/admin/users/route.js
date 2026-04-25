export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Class from '@/models/Class';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  const users = await User.find({}, '-password')
    .populate('assignedClasses')
    .sort({ createdAt: -1 });
  return Response.json(users);
}

export async function POST(req) {
  await connectDB();
  const { username, password, name, role, assignedClasses, classTeacherClass, classTeacherSection } = await req.json();
  if (!username || !password || !name || !role)
    return Response.json({ error: 'All fields required' }, { status: 400 });
  const exists = await User.findOne({ username });
  if (exists)
    return Response.json({ error: 'Username already taken' }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username, password: hashed, name, role,
    assignedClasses: assignedClasses || [],
    classTeacherClass: classTeacherClass || null,
    classTeacherSection: classTeacherSection || null,
  });
  const populated = await User.findById(user._id, '-password').populate('assignedClasses');
  return Response.json(populated, { status: 201 });
}