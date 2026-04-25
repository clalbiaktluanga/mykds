export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Class from '@/models/Class';
import { sortClassesBySubject } from '@/lib/subjects';

export async function GET() {
  await connectDB();
  // Get all classes grouped by name+section
  const classes = await Class.find().sort({ name: 1, section: 1 });
  
  // Group by class+section, collect subjects
  const grouped = {};
  classes.forEach(cls => {
    const key = `${cls.name}||${cls.section}`;
    if (!grouped[key]) {
      grouped[key] = {
        className: cls.name,
        section: cls.section,
        academicYear: cls.academicYear,
        subjects: [],
        classIds: [],
      };
    }
    grouped[key].subjects.push({ 
      _id: cls._id, 
      subject: cls.subject 
    });
    grouped[key].classIds.push(cls._id);
  });

  const result = Object.values(grouped).map(g => ({
    ...g,
    subjects: sortClassesBySubject(g.subjects)
  }));

  return Response.json(result);
}