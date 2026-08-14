const mongoose = require('mongoose');

const options = { timestamps: true, versionKey: false };

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['warden', 'student'], required: true },
  studentId: { type: String, trim: true },
  phone: String,
  course: String,
  year: String,
  guardianName: String,
  guardianPhone: String,
  address: String,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  avatar: String,
  active: { type: Boolean, default: true }
}, options);

const RoomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true, trim: true },
  block: { type: String, required: true, trim: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['Single', 'Double', 'Triple', 'Four Sharing'], default: 'Double' },
  capacity: { type: Number, min: 1, max: 8, required: true },
  amenities: [String],
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' }
}, options);

const LeaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true, trim: true },
  destination: String,
  emergencyContact: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  wardenNote: String
}, options);

const FeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, min: 0, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
  paidAt: Date,
  transactionId: String
}, options);

const ComplaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  resolution: String
}, options);

const VisitorSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitorName: { type: String, required: true },
  relation: { type: String, required: true },
  phone: String,
  visitDate: { type: Date, required: true },
  visitTime: String,
  purpose: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Checked In', 'Checked Out', 'Rejected'], default: 'Pending' }
}, options);

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Room: mongoose.models.Room || mongoose.model('Room', RoomSchema),
  Leave: mongoose.models.Leave || mongoose.model('Leave', LeaveSchema),
  Fee: mongoose.models.Fee || mongoose.model('Fee', FeeSchema),
  Complaint: mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema),
  Visitor: mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema)
};
