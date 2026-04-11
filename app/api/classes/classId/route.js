import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';

export async function GET(req, { params }) {
  await connectDB();

  const classId = params.classId;
  console.log('GET class by ID:', classId);

  try {
    const cls = await Class.findById(classId);
    if (!cls) {
      console.log('Class not found for ID:', classId);
      return Response.json({ error: 'Class not found' }, { status: 404 });
    }
    console.log('Class found:', cls.name, cls.section);
    return Response.json(cls);
  } catch (err) {
    console.log('Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}