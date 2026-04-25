export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Mark from '@/models/Mark';
import User from '@/models/User';
import Setting from '@/models/Settings';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sortClassesBySubject } from '@/lib/subjects';

export async function GET(req) {
  await connectDB();

  const setting = await Setting.findOne({ key: 'classTeacherViewEnabled' });
  if (!setting?.value) {
    return Response.json({ error: 'Class teacher view is disabled' }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(session.user.id);
  if (!user || !user.classTeacherClass || !user.classTeacherSection) {
    return Response.json({ error: 'You are not assigned as a class teacher' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const className = searchParams.get('class');
  const section = searchParams.get('section');
  const type = searchParams.get('type') || 'classtest';
  const index = parseInt(searchParams.get('index') || '1');

  const isCumulative = searchParams.get('cumulative') === 'true';

  if (!className || !section) {
    return Response.json({ error: 'Missing params' }, { status: 400 });
  }

  if (className !== user.classTeacherClass || section !== user.classTeacherSection) {
    return Response.json({ error: 'You can only view reports for your assigned class' }, { status: 403 });
  }

  // Get all classes for this class+section (one per subject)
  const unsortedClasses = await Class.find({ name: className, section });
  const classes = sortClassesBySubject(unsortedClasses);

  // Get all students in this class+section
  const students = await Student.find({ class: className, section })
    .sort({ rollNo: 1 });

  // For each student, get marks for each subject class
  const studentData = await Promise.all(students.map(async (student) => {
    const marksBySubject = {};
    await Promise.all(classes.map(async (cls) => {
      if (isCumulative) {
        const marks = await Mark.find({
          student: student._id,
          class: cls._id,
          type: 'exam',
          index: { $in: [1, 2, 3] }
        });
        const cumulativeMarks = { 1: null, 2: null, 3: null };
        marks.forEach(m => {
          if (m.index === 1 || m.index === 2 || m.index === 3) {
            cumulativeMarks[m.index] = m.marksObtained ?? null;
          }
        });
        marksBySubject[cls.subject] = cumulativeMarks;
      } else {
        const mark = await Mark.findOne({
          student: student._id,
          class: cls._id,
          type,
          index,
        });
        marksBySubject[cls.subject] = mark?.marksObtained ?? null;
      }
    }));
    return {
      _id: student._id,
      rollNo: student.rollNo,
      name: student.name,
      marks: marksBySubject,
    };
  }));

  return Response.json({
    students: studentData,
    subjects: classes.map(c => c.subject),
    classes,
    classTeacherName: user.name || user.username || 'Class Teacher',
  });
}
