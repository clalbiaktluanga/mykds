import mongoose from 'mongoose';

// Delete cached model to avoid stale schema issues
if (mongoose.models.Class) delete mongoose.models.Class;

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  academicYear: { type: String, default: '2024-25' },
  terms: { type: Number, default: 3 },
  tests: { type: Number, default: 5 },
  enableAttendance: { type: Boolean, default: true },
  lockedTests: [{ type: Number }],
  lockedTerms: [{ type: Number }],
}, { timestamps: true });

export default mongoose.model('Class', ClassSchema);