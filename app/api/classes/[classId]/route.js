import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';

export async function GET(req, { params }) {
  await connectDB();
  try {
    const cls = await Class.findById(params.classId);
    if (!cls) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(cls);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}