import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Class from '@/models/Class';
import Setting from '@/models/Settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();

  // Check if feature is enabled
  const setting = await Setting.findOne({ key: 'classTeacherViewEnabled' });
  if (!setting?.value) {
    return Response.json({ enabled: false, classes: [] });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(session.user.id).populate('assignedClasses');
  if (!user) return Response.json({ enabled: true, classes: [] });

  return Response.json({ enabled: true, classes: user.assignedClasses || [] });
}