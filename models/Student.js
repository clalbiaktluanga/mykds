import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  academicYear: { type: String, default: '2024-25' },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);