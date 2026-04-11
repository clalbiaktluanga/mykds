import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import Student from '@/models/Student';

export async function GET(req, { params }) {
  await connectDB();

  const classId = params.classId;
  console.log('Looking for students in classId:', classId);

  try {
    const cls = await Class.findById(classId);
    console.log('Class found:', cls);

    if (!cls) return Response.json({ error: 'Class not found' }, { status: 404 });

    console.log('Querying students with class:', cls.name, 'section:', cls.section);

    // Try exact match first (class name + section)
    let students = await Student.find({
      class: cls.name,
      section: cls.section,
    }).sort({ rollNo: 1 });

    console.log('Exact match students found:', students.length);

    // If nothing found, try matching just by class name (ignore section)
    if (students.length === 0) {
      console.log('No exact match, trying class name only...');
      students = await Student.find({
        class: cls.name,
      }).sort({ rollNo: 1 });
      console.log('Loose match students found:', students.length);
    }

    return Response.json(students);

  } catch (err) {
    console.log('Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}