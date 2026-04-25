export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import Student from '@/models/Student';

export async function GET(req, { params }) {
  await connectDB();
  try {
    const cls = await Class.findById(params.classId);
    if (!cls) return Response.json({ error: 'Class not found' }, { status: 404 });

    let students = await Student.find({
      class: cls.name,
      section: cls.section,
    }).sort({ rollNo: 1 });

    if (students.length === 0) {
      students = await Student.find({ class: cls.name }).sort({ rollNo: 1 });
    }

    return Response.json(students);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}