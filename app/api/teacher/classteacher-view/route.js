import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Class from '@/models/Class';
import Setting from '@/models/Settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sortClassesBySubject } from '@/lib/subjects';

export async function GET() {
  await connectDB();

  const setting = await Setting.findOne({ key: 'classTeacherViewEnabled' });
  if (!setting?.value) {
    return Response.json({ enabled: false, assigned: false });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(session.user.id);
  if (!user || !user.classTeacherClass || !user.classTeacherSection) {
    return Response.json({ enabled: true, assigned: false });
  }

  const unsortedClasses = await Class.find({
    name: user.classTeacherClass,
    section: user.classTeacherSection,
  });
  
  const classes = sortClassesBySubject(unsortedClasses);

  return Response.json({
    enabled: true,
    assigned: true,
    classTeacherClass: user.classTeacherClass,
    classTeacherSection: user.classTeacherSection,
    classes,
  });
}