import mongoose from 'mongoose';

const MarksLogSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  type: { type: String, enum: ['classtest', 'exam'], required: true },
  index: { type: Number, required: true },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editedByName: { type: String },
  changes: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String },
    rollNo: { type: String },
    oldValue: { type: Number, default: null },
    newValue: { type: Number, default: null },
  }],
  editedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.MarksLog ||
  mongoose.model('MarksLog', MarksLogSchema);