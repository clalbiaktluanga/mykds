import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Mark from '@/models/Mark';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const className = searchParams.get('class');
  const section = searchParams.get('section');
  const type = searchParams.get('type') || 'classtest';
  const index = parseInt(searchParams.get('index') || '1');

  if (!className || !section)
    return Response.json({ error: 'Missing params' }, { status: 400 });

  // Get all classes for this class+section (one per subject)
  const classes = await Class.find({ name: className, section });

  // Get all students in this class+section
  const students = await Student.find({ class: className, section })
    .sort({ rollNo: 1 });

  // For each student, get marks for each subject class
  const studentData = await Promise.all(students.map(async (student) => {
    const marksBySubject = {};
    await Promise.all(classes.map(async (cls) => {
      const mark = await Mark.findOne({
        student: student._id,
        class: cls._id,
        type,
        index,
      });
      marksBySubject[cls.subject] = mark?.marksObtained ?? null;
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
  });
}