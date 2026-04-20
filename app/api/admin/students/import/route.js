import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(req) {
  try {
    await connectDB();
    const students = await req.json();

    if (!Array.isArray(students)) {
      return Response.json({ error: 'Expected an array of students' }, { status: 400 });
    }

    let importedCount = 0;
    
    // We update matches or insert new ones
    for (const student of students) {
      const { rollNo, name, parentName, class: cls, section, academicYear } = student;
      
      if (!rollNo || !name || !cls) {
        continue; // Skip invalid rows
      }

      await Student.findOneAndUpdate(
        { rollNo, class: cls, academicYear: academicYear || '2026' }, // Match query
        { name, parentName, section: section || 'A' },               // Update payload
        { upsert: true, new: true }                                  // Create if not exists
      );
      importedCount++;
    }

    return Response.json({ success: true, importedCount }, { status: 200 });
  } catch (error) {
    console.error('Import error:', error);
    return Response.json({ error: 'Failed to import students' }, { status: 500 });
  }
}
