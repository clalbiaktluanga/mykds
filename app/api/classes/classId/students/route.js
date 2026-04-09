import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import Student from '@/models/Student';

export async function GET(req, { params }) {
  await connectDB();

  // Find the class to get its name and section
  const cls = await Class.findById(params.classId);
  if (!cls) return Response.json({ error: 'Class not found' }, { status: 404 });

  // Find students matching that class name and section
  const students = await Student.find({
    class: cls.name,
    section: cls.section,
  }).sort({ rollNo: 1 });

  return Response.json(students);
}