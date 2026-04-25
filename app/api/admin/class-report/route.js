export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Mark from '@/models/Mark';
import User from '@/models/User';
import { sortClassesBySubject } from '@/lib/subjects';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const className = searchParams.get('class');
  const section = searchParams.get('section');
  const type = searchParams.get('type') || 'classtest';
  const index = parseInt(searchParams.get('index') || '1');

  const isCumulative = searchParams.get('cumulative') === 'true';

  if (!className || !section)
    return Response.json({ error: 'Missing params' }, { status: 400 });

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

  const classTeacherUser = await User.findOne({ 
    role: { $in: ['classTeacher', 'teacher'] },
    classTeacherClass: className, 
    classTeacherSection: section 
  });
  const classTeacherName = classTeacherUser ? (classTeacherUser.name || classTeacherUser.username) : 'Class Teacher';

  return Response.json({
    students: studentData,
    subjects: classes.map(c => c.subject),
    classes,
    classTeacherName,
  });
}