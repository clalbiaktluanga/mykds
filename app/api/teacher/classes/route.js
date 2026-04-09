import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Class from '@/models/Class';
import { getServerSession } from 'next-auth';

export async function GET() {
  await connectDB();
  const session = await getServerSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await User.findOne({ username: session.user.name })
    .populate('assignedClasses');
  if (!user) return Response.json([]);
  return Response.json(user.assignedClasses || []);
}