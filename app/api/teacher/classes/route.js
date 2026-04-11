import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Class from '@/models/Class';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  console.log('Session in teacher/classes:', session);

  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await User.findById(session.user.id)
    .populate('assignedClasses');

  if (!user) return Response.json([]);

  return Response.json(user.assignedClasses || []);
}