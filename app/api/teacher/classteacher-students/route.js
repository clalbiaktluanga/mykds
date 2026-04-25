export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Student from '@/models/Student';
import Setting from '@/models/Settings';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();

  const setting = await Setting.findOne({ key: 'classTeacherViewEnabled' });
  if (!setting?.value) return Response.json({ error: 'Feature disabled' }, { status: 403 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(session.user.id);
  if (!user?.classTeacherClass || !user?.classTeacherSection)
    return Response.json({ error: 'No class teacher assignment' }, { status: 403 });

  const students = await Student.find({
    class: user.classTeacherClass,
    section: user.classTeacherSection,
  }).sort({ rollNo: 1 });

  return Response.json(students);
}