import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  academicYear: { type: String, default: '2024-25' },
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model('Class', ClassSchema);