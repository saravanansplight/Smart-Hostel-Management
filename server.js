const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ExcelJS = require('exceljs');
const Models = require('./models');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';
const JWT_SECRET = process.env.JWT_SECRET || 'smart-hostel-development-secret-change-in-production';
const MONGO_URI = process.env.MONGODB_URI || '';
let mongoMode = false;

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }));

const clone = (value) => JSON.parse(JSON.stringify(value));
const id = (prefix, index) => `${prefix}-${String(index).padStart(3, '0')}`;
const iso = (date) => new Date(date).toISOString();
const now = new Date();
const day = 86400000;

const memory = { users: [], rooms: [], leaves: [], fees: [], complaints: [], visitors: [] };

async function seedMemory() {
  const wardenPass = await bcrypt.hash('Warden@123', 12);
  const studentPass = await bcrypt.hash('Student@123', 12);

  memory.rooms = [
    { _id: id('room', 1), number: 'A-101', block: 'A Block', floor: 1, type: 'Double', capacity: 2, amenities: ['Wi-Fi', 'Study table', 'Attached bath'], status: 'Occupied', createdAt: iso(now - 80 * day) },
    { _id: id('room', 2), number: 'A-102', block: 'A Block', floor: 1, type: 'Double', capacity: 2, amenities: ['Wi-Fi', 'Study table'], status: 'Occupied', createdAt: iso(now - 80 * day) },
    { _id: id('room', 3), number: 'A-103', block: 'A Block', floor: 1, type: 'Triple', capacity: 3, amenities: ['Wi-Fi', 'Balcony', 'Study table'], status: 'Available', createdAt: iso(now - 80 * day) },
    { _id: id('room', 4), number: 'A-201', block: 'A Block', floor: 2, type: 'Single', capacity: 1, amenities: ['Wi-Fi', 'Attached bath'], status: 'Occupied', createdAt: iso(now - 80 * day) },
    { _id: id('room', 5), number: 'B-101', block: 'B Block', floor: 1, type: 'Double', capacity: 2, amenities: ['Wi-Fi', 'Study table'], status: 'Available', createdAt: iso(now - 75 * day) },
    { _id: id('room', 6), number: 'B-102', block: 'B Block', floor: 1, type: 'Four Sharing', capacity: 4, amenities: ['Wi-Fi', 'Balcony', 'Common bath'], status: 'Occupied', createdAt: iso(now - 75 * day) },
    { _id: id('room', 7), number: 'B-201', block: 'B Block', floor: 2, type: 'Triple', capacity: 3, amenities: ['Wi-Fi', 'Study table'], status: 'Maintenance', createdAt: iso(now - 75 * day) },
    { _id: id('room', 8), number: 'C-101', block: 'C Block', floor: 1, type: 'Double', capacity: 2, amenities: ['Wi-Fi', 'Attached bath', 'AC'], status: 'Available', createdAt: iso(now - 60 * day) }
  ];

  memory.users = [
    { _id: id('user', 1), name: 'Dr. Meera Nair', email: 'warden@smartstay.edu', password: wardenPass, role: 'warden', phone: '+91 98765 10001', active: true, createdAt: iso(now - 400 * day) },
    { _id: id('user', 2), name: 'Arun Kumar', email: 'arun@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026001', phone: '+91 98765 21001', course: 'B.Tech Computer Science', year: '3rd Year', guardianName: 'R. Senthil Kumar', guardianPhone: '+91 98430 12001', address: 'Erode, Tamil Nadu', roomId: id('room', 1), active: true, createdAt: iso(now - 180 * day) },
    { _id: id('user', 3), name: 'Priya Sharma', email: 'priya@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026002', phone: '+91 98765 21002', course: 'B.Com Finance', year: '2nd Year', guardianName: 'Anil Sharma', guardianPhone: '+91 98430 12002', address: 'Kochi, Kerala', roomId: id('room', 1), active: true, createdAt: iso(now - 170 * day) },
    { _id: id('user', 4), name: 'Rahul Verma', email: 'rahul@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026003', phone: '+91 98765 21003', course: 'B.Sc Physics', year: '1st Year', guardianName: 'Mahesh Verma', guardianPhone: '+91 98430 12003', address: 'Salem, Tamil Nadu', roomId: id('room', 2), active: true, createdAt: iso(now - 160 * day) },
    { _id: id('user', 5), name: 'Nisha Patel', email: 'nisha@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026004', phone: '+91 98765 21004', course: 'BBA', year: '2nd Year', guardianName: 'Jignesh Patel', guardianPhone: '+91 98430 12004', address: 'Ahmedabad, Gujarat', roomId: id('room', 2), active: true, createdAt: iso(now - 145 * day) },
    { _id: id('user', 6), name: 'Aisha Khan', email: 'aisha@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026005', phone: '+91 98765 21005', course: 'B.Arch', year: '4th Year', guardianName: 'Faisal Khan', guardianPhone: '+91 98430 12005', address: 'Mysuru, Karnataka', roomId: id('room', 4), active: true, createdAt: iso(now - 140 * day) },
    { _id: id('user', 7), name: 'Vikram Singh', email: 'vikram@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026006', phone: '+91 98765 21006', course: 'B.Tech Mechanical', year: '3rd Year', guardianName: 'Rajan Singh', guardianPhone: '+91 98430 12006', address: 'Jaipur, Rajasthan', roomId: id('room', 6), active: true, createdAt: iso(now - 130 * day) },
    { _id: id('user', 8), name: 'Divya Raj', email: 'divya@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026007', phone: '+91 98765 21007', course: 'MCA', year: '1st Year', guardianName: 'Suresh Raj', guardianPhone: '+91 98430 12007', address: 'Madurai, Tamil Nadu', roomId: id('room', 6), active: true, createdAt: iso(now - 120 * day) },
    { _id: id('user', 9), name: 'Karthik Iyer', email: 'karthik@smartstay.edu', password: studentPass, role: 'student', studentId: 'SH2026008', phone: '+91 98765 21008', course: 'B.Sc Mathematics', year: '2nd Year', guardianName: 'Ganesh Iyer', guardianPhone: '+91 98430 12008', address: 'Coimbatore, Tamil Nadu', roomId: null, active: true, createdAt: iso(now - 110 * day) }
  ];

  memory.leaves = [
    { _id: id('leave', 1), studentId: id('user', 2), fromDate: iso(now.getTime() + 3 * day), toDate: iso(now.getTime() + 5 * day), reason: 'Family function in hometown', destination: 'Erode', emergencyContact: '+91 98430 12001', status: 'Pending', wardenNote: '', createdAt: iso(now - 2 * day) },
    { _id: id('leave', 2), studentId: id('user', 3), fromDate: iso(now.getTime() + 1 * day), toDate: iso(now.getTime() + 2 * day), reason: 'Medical appointment', destination: 'Kochi', emergencyContact: '+91 98430 12002', status: 'Approved', wardenNote: 'Travel safely.', createdAt: iso(now - 4 * day) },
    { _id: id('leave', 3), studentId: id('user', 5), fromDate: iso(now - 7 * day), toDate: iso(now - 5 * day), reason: 'Festival leave', destination: 'Ahmedabad', emergencyContact: '+91 98430 12004', status: 'Approved', wardenNote: '', createdAt: iso(now - 10 * day) },
    { _id: id('leave', 4), studentId: id('user', 7), fromDate: iso(now.getTime() + 6 * day), toDate: iso(now.getTime() + 10 * day), reason: 'Personal work', destination: 'Jaipur', emergencyContact: '+91 98430 12006', status: 'Rejected', wardenNote: 'Academic assessment scheduled.', createdAt: iso(now - 3 * day) }
  ];

  memory.fees = [
    { _id: id('fee', 1), studentId: id('user', 2), title: 'Hostel Fee — Semester 5', amount: 42000, dueDate: iso(now.getTime() + 12 * day), status: 'Pending', createdAt: iso(now - 15 * day) },
    { _id: id('fee', 2), studentId: id('user', 2), title: 'Mess Fee — July', amount: 4500, dueDate: iso(now - 25 * day), status: 'Paid', paidAt: iso(now - 30 * day), transactionId: 'TXN8R2K401', createdAt: iso(now - 45 * day) },
    { _id: id('fee', 3), studentId: id('user', 3), title: 'Hostel Fee — Semester 3', amount: 39000, dueDate: iso(now - 2 * day), status: 'Overdue', createdAt: iso(now - 25 * day) },
    { _id: id('fee', 4), studentId: id('user', 4), title: 'Hostel Fee — Semester 1', amount: 40000, dueDate: iso(now.getTime() + 8 * day), status: 'Pending', createdAt: iso(now - 18 * day) },
    { _id: id('fee', 5), studentId: id('user', 5), title: 'Mess Fee — August', amount: 4700, dueDate: iso(now.getTime() + 4 * day), status: 'Paid', paidAt: iso(now - 1 * day), transactionId: 'TXN5A1P229', createdAt: iso(now - 12 * day) },
    { _id: id('fee', 6), studentId: id('user', 6), title: 'Maintenance Charge', amount: 1800, dueDate: iso(now.getTime() + 15 * day), status: 'Pending', createdAt: iso(now - 5 * day) }
  ];

  memory.complaints = [
    { _id: id('complaint', 1), studentId: id('user', 2), category: 'Electrical', subject: 'Study light is flickering', description: 'The study light near bed 1 has been flickering since yesterday.', priority: 'Medium', status: 'In Progress', resolution: 'Electrician assigned for today.', createdAt: iso(now - 1 * day) },
    { _id: id('complaint', 2), studentId: id('user', 3), category: 'Plumbing', subject: 'Low water pressure', description: 'Low water pressure in the attached bathroom during mornings.', priority: 'High', status: 'Open', resolution: '', createdAt: iso(now - 2 * day) },
    { _id: id('complaint', 3), studentId: id('user', 6), category: 'Internet', subject: 'Wi-Fi disconnecting frequently', description: 'Wi-Fi disconnects every 15 minutes in A Block second floor.', priority: 'Medium', status: 'Resolved', resolution: 'Access point restarted and firmware updated.', createdAt: iso(now - 8 * day) },
    { _id: id('complaint', 4), studentId: id('user', 7), category: 'Housekeeping', subject: 'Corridor cleaning required', description: 'B Block first-floor corridor requires cleaning.', priority: 'Low', status: 'Open', resolution: '', createdAt: iso(now - 1 * day) }
  ];

  memory.visitors = [
    { _id: id('visitor', 1), studentId: id('user', 2), visitorName: 'R. Senthil Kumar', relation: 'Father', phone: '+91 98430 12001', visitDate: iso(now.getTime() + 2 * day), visitTime: '11:00', purpose: 'Personal visit', status: 'Approved', createdAt: iso(now - 1 * day) },
    { _id: id('visitor', 2), studentId: id('user', 4), visitorName: 'Mahesh Verma', relation: 'Father', phone: '+91 98430 12003', visitDate: iso(now), visitTime: '16:30', purpose: 'Deliver books', status: 'Checked In', createdAt: iso(now - 2 * day) },
    { _id: id('visitor', 3), studentId: id('user', 5), visitorName: 'Riya Patel', relation: 'Sister', phone: '+91 98430 22334', visitDate: iso(now.getTime() + 4 * day), visitTime: '10:30', purpose: 'Weekend visit', status: 'Pending', createdAt: iso(now - 1 * day) }
  ];
}

const mapName = { users: 'User', rooms: 'Room', leaves: 'Leave', fees: 'Fee', complaints: 'Complaint', visitors: 'Visitor' };
const model = (collection) => Models[mapName[collection]];
const nextId = (collection) => id(collection.slice(0, -1), memory[collection].length + 1 + Math.floor(Math.random() * 900));

async function list(collection, query = {}) {
  if (mongoMode) return model(collection).find(query).lean();
  return clone(memory[collection].filter((item) => Object.entries(query).every(([key, value]) => String(item[key] || '') === String(value))));
}

async function findOne(collection, query) {
  if (mongoMode) return model(collection).findOne(query).lean();
  return clone(memory[collection].find((item) => Object.entries(query).every(([key, value]) => String(item[key] || '') === String(value))) || null);
}

async function findById(collection, itemId) {
  if (mongoMode) {
    if (!mongoose.isValidObjectId(itemId)) return null;
    return model(collection).findById(itemId).lean();
  }
  return clone(memory[collection].find((item) => item._id === itemId) || null);
}

async function createOne(collection, payload) {
  if (mongoMode) return (await model(collection).create(payload)).toObject();
  const item = { _id: nextId(collection), ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  memory[collection].push(item);
  return clone(item);
}

async function updateOne(collection, itemId, payload) {
  if (mongoMode) return model(collection).findByIdAndUpdate(itemId, payload, { new: true, runValidators: true }).lean();
  const index = memory[collection].findIndex((item) => item._id === itemId);
  if (index < 0) return null;
  memory[collection][index] = { ...memory[collection][index], ...payload, updatedAt: new Date().toISOString() };
  return clone(memory[collection][index]);
}

async function removeOne(collection, itemId) {
  if (mongoMode) return model(collection).findByIdAndDelete(itemId).lean();
  const index = memory[collection].findIndex((item) => item._id === itemId);
  if (index < 0) return null;
  return clone(memory[collection].splice(index, 1)[0]);
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

async function enrich(items) {
  const users = await list('users', { role: 'student' });
  const rooms = await list('rooms');
  const userMap = Object.fromEntries(users.map((u) => [String(u._id), publicUser(u)]));
  const roomMap = Object.fromEntries(rooms.map((r) => [String(r._id), r]));
  return items.map((item) => ({
    ...item,
    student: item.studentId ? userMap[String(item.studentId)] || null : undefined,
    room: item.roomId ? roomMap[String(item.roomId)] || null : undefined
  }));
}

async function roomsWithOccupancy() {
  const [rooms, students] = await Promise.all([list('rooms'), list('users', { role: 'student' })]);
  return rooms.map((room) => {
    const occupants = students.filter((student) => String(student.roomId || '') === String(room._id));
    return { ...room, occupants: occupants.map(publicUser), occupiedBeds: occupants.length, vacantBeds: Math.max(0, room.capacity - occupants.length) };
  });
}

function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: '8h', issuer: 'smart-hostel' });
}

async function authenticate(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    const token = req.cookies.hostel_token || bearer;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    const decoded = jwt.verify(token, JWT_SECRET, { issuer: 'smart-hostel' });
    const user = await findById('users', decoded.sub);
    if (!user || !user.active) return res.status(401).json({ message: 'Account is unavailable.' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
}

const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission to perform this action.' });
const required = (body, fields) => fields.filter((field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === '');
const notFound = (res, label) => res.status(404).json({ message: `${label} not found.` });

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoMode ? 'MongoDB Atlas' : 'Demo data store', connected: mongoMode }));

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = String(req.body.role || '');
    if (!email || !password || !['warden', 'student'].includes(role)) return res.status(400).json({ message: 'Email, password and portal type are required.' });
    const user = await findOne('users', { email });
    if (!user || user.role !== role || !user.active || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials for the selected portal.' });
    const token = signToken(user);
    res.cookie('hostel_token', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
    res.json({ message: 'Signed in successfully.', user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to sign in right now.' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('hostel_token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Signed out successfully.' });
});

// Session check intentionally returns 200 with user:null when signed out.
// This lets the login page load cleanly without an expected 401 error in DevTools.
app.get('/api/auth/me', async (req, res) => {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    const token = req.cookies.hostel_token || bearer;
    if (!token) return res.json({ user: null });
    const decoded = jwt.verify(token, JWT_SECRET, { issuer: 'smart-hostel' });
    const user = await findById('users', decoded.sub);
    if (!user || !user.active) return res.json({ user: null });
    const room = user.roomId ? await findById('rooms', user.roomId) : null;
    return res.json({ user: { ...publicUser(user), room } });
  } catch (_error) {
    res.clearCookie('hostel_token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    return res.json({ user: null });
  }
});

app.get('/api/dashboard', authenticate, async (req, res) => {
  const [rooms, students, leaves, fees, complaints, visitors] = await Promise.all([
    roomsWithOccupancy(), list('users', { role: 'student' }), list('leaves'), list('fees'), list('complaints'), list('visitors')
  ]);
  if (req.user.role === 'warden') {
    const activeStudents = students.filter((s) => s.active);
    const collected = fees.filter((f) => f.status === 'Paid').reduce((sum, fee) => sum + Number(fee.amount), 0);
    const pendingAmount = fees.filter((f) => f.status !== 'Paid').reduce((sum, fee) => sum + Number(fee.amount), 0);
    const recent = [
      ...leaves.map((x) => ({ type: 'leave', title: `${students.find((s) => String(s._id) === String(x.studentId))?.name || 'Student'} requested leave`, status: x.status, at: x.createdAt })),
      ...complaints.map((x) => ({ type: 'complaint', title: x.subject, status: x.status, at: x.createdAt })),
      ...visitors.map((x) => ({ type: 'visitor', title: `Visit by ${x.visitorName}`, status: x.status, at: x.createdAt }))
    ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);
    return res.json({
      stats: { students: activeStudents.length, rooms: rooms.length, occupiedBeds: rooms.reduce((s, r) => s + r.occupiedBeds, 0), totalBeds: rooms.reduce((s, r) => s + r.capacity, 0), pendingLeaves: leaves.filter((x) => x.status === 'Pending').length, openComplaints: complaints.filter((x) => x.status !== 'Resolved').length, visitorsToday: visitors.filter((x) => new Date(x.visitDate).toDateString() === now.toDateString()).length, collected, pendingAmount },
      roomOccupancy: rooms, recent
    });
  }

  const mine = (items) => items.filter((item) => String(item.studentId) === String(req.user._id));
  const myFees = mine(fees);
  const myRoom = rooms.find((r) => String(r._id) === String(req.user.roomId)) || null;
  res.json({
    stats: { pendingFees: myFees.filter((x) => x.status !== 'Paid').reduce((s, x) => s + Number(x.amount), 0), pendingLeaves: mine(leaves).filter((x) => x.status === 'Pending').length, openComplaints: mine(complaints).filter((x) => x.status !== 'Resolved').length, approvedVisitors: mine(visitors).filter((x) => ['Approved', 'Checked In'].includes(x.status)).length },
    room: myRoom,
    upcomingLeave: mine(leaves).filter((x) => x.status === 'Approved' && new Date(x.toDate) >= new Date()).sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))[0] || null,
    recentFees: myFees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
    recentComplaints: mine(complaints).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
  });
});

// Rooms
app.get('/api/rooms', authenticate, async (_req, res) => res.json({ rooms: await roomsWithOccupancy() }));
app.post('/api/rooms', authenticate, allow('warden'), async (req, res) => {
  try {
    const missing = required(req.body, ['number', 'block', 'floor', 'type', 'capacity']);
    if (missing.length) return res.status(400).json({ message: `Required: ${missing.join(', ')}` });
    if (await findOne('rooms', { number: String(req.body.number).trim() })) return res.status(409).json({ message: 'A room with this number already exists.' });
    const room = await createOne('rooms', { number: String(req.body.number).trim().toUpperCase(), block: String(req.body.block).trim(), floor: Number(req.body.floor), type: req.body.type, capacity: Number(req.body.capacity), amenities: Array.isArray(req.body.amenities) ? req.body.amenities : String(req.body.amenities || '').split(',').map((x) => x.trim()).filter(Boolean), status: req.body.status || 'Available' });
    res.status(201).json({ message: 'Room created.', room });
  } catch (error) { res.status(400).json({ message: error.message || 'Unable to create room.' }); }
});
app.put('/api/rooms/:id', authenticate, allow('warden'), async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload._id; delete payload.occupants; delete payload.occupiedBeds; delete payload.vacantBeds;
    if (payload.capacity) payload.capacity = Number(payload.capacity);
    if (payload.floor) payload.floor = Number(payload.floor);
    if (typeof payload.amenities === 'string') payload.amenities = payload.amenities.split(',').map((x) => x.trim()).filter(Boolean);
    const room = await updateOne('rooms', req.params.id, payload);
    room ? res.json({ message: 'Room updated.', room }) : notFound(res, 'Room');
  } catch (error) { res.status(400).json({ message: error.message || 'Unable to update room.' }); }
});
app.delete('/api/rooms/:id', authenticate, allow('warden'), async (req, res) => {
  const occupants = (await list('users', { role: 'student' })).filter((s) => String(s.roomId || '') === req.params.id);
  if (occupants.length) return res.status(409).json({ message: 'Reassign the room occupants before deleting this room.' });
  const room = await removeOne('rooms', req.params.id);
  room ? res.json({ message: 'Room deleted.' }) : notFound(res, 'Room');
});
app.post('/api/rooms/:id/allocate', authenticate, allow('warden'), async (req, res) => {
  const room = await findById('rooms', req.params.id);
  const student = await findById('users', req.body.studentId);
  if (!room) return notFound(res, 'Room');
  if (!student || student.role !== 'student') return notFound(res, 'Student');
  if (room.status === 'Maintenance') return res.status(409).json({ message: 'A room under maintenance cannot accept occupants.' });
  const occupants = (await list('users', { role: 'student' })).filter((s) => String(s.roomId || '') === String(room._id));
  if (occupants.length >= room.capacity && String(student.roomId || '') !== String(room._id)) return res.status(409).json({ message: 'This room has no vacant beds.' });
  const oldRoomId = student.roomId;
  await updateOne('users', String(student._id), { roomId: room._id });
  await updateOne('rooms', String(room._id), { status: occupants.length + (String(student.roomId || '') === String(room._id) ? 0 : 1) >= room.capacity ? 'Occupied' : 'Available' });
  if (oldRoomId && String(oldRoomId) !== String(room._id)) {
    const oldOccupants = (await list('users', { role: 'student' })).filter((s) => String(s.roomId || '') === String(oldRoomId));
    await updateOne('rooms', String(oldRoomId), { status: oldOccupants.length ? 'Occupied' : 'Available' });
  }
  res.json({ message: `${student.name} allocated to room ${room.number}.` });
});
app.delete('/api/rooms/:id/allocate/:studentId', authenticate, allow('warden'), async (req, res) => {
  const student = await findById('users', req.params.studentId);
  if (!student || String(student.roomId || '') !== req.params.id) return notFound(res, 'Allocation');
  await updateOne('users', req.params.studentId, { roomId: null });
  const remaining = (await list('users', { role: 'student' })).filter((s) => String(s.roomId || '') === req.params.id);
  await updateOne('rooms', req.params.id, { status: remaining.length ? 'Occupied' : 'Available' });
  res.json({ message: 'Room allocation removed.' });
});

// Students
app.get('/api/students', authenticate, allow('warden'), async (_req, res) => {
  const students = await enrich((await list('users', { role: 'student' })).map(publicUser));
  res.json({ students });
});
app.post('/api/students', authenticate, allow('warden'), async (req, res) => {
  try {
    const missing = required(req.body, ['name', 'email', 'studentId', 'phone', 'course', 'year']);
    if (missing.length) return res.status(400).json({ message: `Required: ${missing.join(', ')}` });
    const email = String(req.body.email).trim().toLowerCase();
    if (await findOne('users', { email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const password = String(req.body.password || 'Student@123');
    if (password.length < 8) return res.status(400).json({ message: 'Temporary password must contain at least 8 characters.' });
    const student = await createOne('users', { name: String(req.body.name).trim(), email, password: await bcrypt.hash(password, 12), role: 'student', studentId: String(req.body.studentId).trim().toUpperCase(), phone: req.body.phone, course: req.body.course, year: req.body.year, guardianName: req.body.guardianName || '', guardianPhone: req.body.guardianPhone || '', address: req.body.address || '', roomId: null, active: true });
    res.status(201).json({ message: `Student added. Temporary password: ${password}`, student: publicUser(student) });
  } catch (error) { res.status(400).json({ message: error.message || 'Unable to add student.' }); }
});
app.put('/api/students/:id', authenticate, allow('warden'), async (req, res) => {
  const payload = { ...req.body };
  delete payload.password; delete payload.role; delete payload._id; delete payload.room; delete payload.createdAt;
  if (payload.email) payload.email = String(payload.email).trim().toLowerCase();
  const student = await updateOne('users', req.params.id, payload);
  student ? res.json({ message: 'Student profile updated.', student: publicUser(student) }) : notFound(res, 'Student');
});
app.patch('/api/students/:id/status', authenticate, allow('warden'), async (req, res) => {
  const student = await updateOne('users', req.params.id, { active: Boolean(req.body.active) });
  student ? res.json({ message: `Student account ${student.active ? 'activated' : 'deactivated'}.`, student: publicUser(student) }) : notFound(res, 'Student');
});

// Profile
app.put('/api/profile', authenticate, async (req, res) => {
  const allowedFields = ['name', 'phone', 'guardianName', 'guardianPhone', 'address'];
  const payload = Object.fromEntries(allowedFields.filter((k) => req.body[k] !== undefined).map((k) => [k, String(req.body[k]).trim()]));
  const user = await updateOne('users', String(req.user._id), payload);
  res.json({ message: 'Profile updated successfully.', user: publicUser(user) });
});
app.put('/api/profile/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!(await bcrypt.compare(String(currentPassword || ''), req.user.password))) return res.status(400).json({ message: 'Current password is incorrect.' });
  if (String(newPassword || '').length < 8) return res.status(400).json({ message: 'New password must contain at least 8 characters.' });
  await updateOne('users', String(req.user._id), { password: await bcrypt.hash(newPassword, 12) });
  res.json({ message: 'Password changed successfully.' });
});

// Leaves
app.get('/api/leaves', authenticate, async (req, res) => {
  let items = await list('leaves');
  if (req.user.role === 'student') items = items.filter((x) => String(x.studentId) === String(req.user._id));
  res.json({ leaves: await enrich(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))) });
});
app.post('/api/leaves', authenticate, allow('student'), async (req, res) => {
  const missing = required(req.body, ['fromDate', 'toDate', 'reason', 'destination', 'emergencyContact']);
  if (missing.length) return res.status(400).json({ message: `Required: ${missing.join(', ')}` });
  if (new Date(req.body.toDate) < new Date(req.body.fromDate)) return res.status(400).json({ message: 'Return date cannot be before departure date.' });
  const leave = await createOne('leaves', { studentId: req.user._id, fromDate: new Date(req.body.fromDate), toDate: new Date(req.body.toDate), reason: String(req.body.reason).trim(), destination: String(req.body.destination).trim(), emergencyContact: String(req.body.emergencyContact).trim(), status: 'Pending', wardenNote: '' });
  res.status(201).json({ message: 'Leave request submitted for approval.', leave });
});
app.patch('/api/leaves/:id/status', authenticate, allow('warden'), async (req, res) => {
  if (!['Approved', 'Rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Select a valid decision.' });
  const leave = await updateOne('leaves', req.params.id, { status: req.body.status, wardenNote: String(req.body.wardenNote || '').trim() });
  leave ? res.json({ message: `Leave request ${req.body.status.toLowerCase()}.`, leave }) : notFound(res, 'Leave request');
});
app.delete('/api/leaves/:id', authenticate, allow('student'), async (req, res) => {
  const leave = await findById('leaves', req.params.id);
  if (!leave || String(leave.studentId) !== String(req.user._id)) return notFound(res, 'Leave request');
  if (leave.status !== 'Pending') return res.status(409).json({ message: 'Only pending requests can be cancelled.' });
  await removeOne('leaves', req.params.id);
  res.json({ message: 'Leave request cancelled.' });
});

// Fees
app.get('/api/fees', authenticate, async (req, res) => {
  let items = await list('fees');
  for (const fee of items) if (fee.status === 'Pending' && new Date(fee.dueDate) < new Date()) fee.status = 'Overdue';
  if (req.user.role === 'student') items = items.filter((x) => String(x.studentId) === String(req.user._id));
  res.json({ fees: await enrich(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))) });
});
app.post('/api/fees', authenticate, allow('warden'), async (req, res) => {
  const missing = required(req.body, ['studentId', 'title', 'amount', 'dueDate']);
  if (missing.length) return res.status(400).json({ message: `Required: ${missing.join(', ')}` });
  const fee = await createOne('fees', { studentId: req.body.studentId, title: String(req.body.title).trim(), amount: Number(req.body.amount), dueDate: new Date(req.body.dueDate), status: 'Pending' });
  res.status(201).json({ message: 'Fee assigned to student.', fee });
});
app.patch('/api/fees/:id/pay', authenticate, allow('student'), async (req, res) => {
  const fee = await findById('fees', req.params.id);
  if (!fee || String(fee.studentId) !== String(req.user._id)) return notFound(res, 'Fee');
  if (fee.status === 'Paid') return res.status(409).json({ message: 'This fee has already been paid.' });
  const transactionId = `SH${Date.now().toString(36).toUpperCase()}`;
  const updated = await updateOne('fees', req.params.id, { status: 'Paid', paidAt: new Date(), transactionId });
  res.json({ message: `Payment recorded successfully. Transaction: ${transactionId}`, fee: updated });
});
app.patch('/api/fees/:id/status', authenticate, allow('warden'), async (req, res) => {
  if (!['Pending', 'Paid', 'Overdue'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid fee status.' });
  const payload = { status: req.body.status };
  if (req.body.status === 'Paid') { payload.paidAt = new Date(); payload.transactionId = req.body.transactionId || `MANUAL-${Date.now()}`; }
  const fee = await updateOne('fees', req.params.id, payload);
  fee ? res.json({ message: 'Fee status updated.', fee }) : notFound(res, 'Fee');
});

// Complaints
app.get('/api/complaints', authenticate, async (req, res) => {
  let items = await list('complaints');
  if (req.user.role === 'student') items = items.filter((x) => String(x.studentId) === String(req.user._id));
  res.json({ complaints: await enrich(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))) });
});
app.post('/api/complaints', authenticate, allow('student'), async (req, res) => {
  const missing = required(req.body, ['category', 'subject', 'description', 'priority']);
  if (missing.length) return res.status(400).json({ message: `Required: ${missing.join(', ')}` });
  const complaint = await createOne('complaints', { studentId: req.user._id, category: req.body.category, subject: String(req.body.subject).trim(), description: String(req.body.description).trim(), priority: req.body.priority, status: 'Open', resolution: '' });
  res.status(201).json({ message: 'Complaint submitted. The warden has been notified.', complaint });
});
app.patch('/api/complaints/:id/status', authenticate, allow('warden'), async (req, res) => {
  if (!['Open', 'In Progress', 'Resolved'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid complaint status.' });
  const complaint = await updateOne('complaints', req.params.id, { status: req.body.status, resolution: String(req.body.resolution || '').trim() });
  complaint ? res.json({ message: 'Complaint updated.', complaint }) : notFound(res, 'Complaint');
});

// Visitors
app.get('/api/visitors', authenticate, async (req, res) => {
  let items = await list('visitors');
  if (req.user.role === 'student') items = items.filter((x) => String(x.studentId) === String(req.user._id));
  res.json({ visitors: await enrich(items.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))) });
});
app.post('/api/visitors', authenticate, async (req, res) => {
  const missing = required(req.body, ['visitorName', 'relation', 'phone', 'visitDate', 'visitTime', 'purpose']);
  if (req.user.role === 'warden' && !req.body.studentId) missing.push('studentId');
  if (missing.length) return res.status(400).json({ message: `Required: ${missing.join(', ')}` });
  const visitor = await createOne('visitors', { studentId: req.user.role === 'student' ? req.user._id : req.body.studentId, visitorName: String(req.body.visitorName).trim(), relation: String(req.body.relation).trim(), phone: String(req.body.phone).trim(), visitDate: new Date(req.body.visitDate), visitTime: req.body.visitTime, purpose: String(req.body.purpose).trim(), status: req.user.role === 'warden' ? (req.body.status || 'Approved') : 'Pending' });
  res.status(201).json({ message: req.user.role === 'student' ? 'Visitor pass requested.' : 'Visitor record added.', visitor });
});
app.patch('/api/visitors/:id/status', authenticate, allow('warden'), async (req, res) => {
  const statuses = ['Pending', 'Approved', 'Checked In', 'Checked Out', 'Rejected'];
  if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid visitor status.' });
  const visitor = await updateOne('visitors', req.params.id, { status: req.body.status });
  visitor ? res.json({ message: `Visitor marked as ${req.body.status.toLowerCase()}.`, visitor }) : notFound(res, 'Visitor record');
});

// Warden-only Excel reports
app.get('/api/reports/:type', authenticate, allow('warden'), async (req, res) => {
  const valid = ['students', 'rooms', 'fees', 'leaves', 'complaints', 'visitors'];
  if (!valid.includes(req.params.type)) return res.status(400).json({ message: 'Invalid report type.' });
  const type = req.params.type;
  let rows = type === 'students' ? await enrich((await list('users', { role: 'student' })).map(publicUser)) : type === 'rooms' ? await roomsWithOccupancy() : await enrich(await list(type));
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SmartStay Hostel Management';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(type[0].toUpperCase() + type.slice(1));
  const columns = {
    students: [['Student ID','studentId'],['Name','name'],['Email','email'],['Phone','phone'],['Course','course'],['Year','year'],['Room','room.number'],['Guardian','guardianName'],['Guardian Phone','guardianPhone'],['Status','active']],
    rooms: [['Room','number'],['Block','block'],['Floor','floor'],['Type','type'],['Capacity','capacity'],['Occupied','occupiedBeds'],['Vacant','vacantBeds'],['Status','status']],
    fees: [['Student ID','student.studentId'],['Student','student.name'],['Fee','title'],['Amount','amount'],['Due Date','dueDate'],['Status','status'],['Transaction ID','transactionId']],
    leaves: [['Student ID','student.studentId'],['Student','student.name'],['From','fromDate'],['To','toDate'],['Reason','reason'],['Destination','destination'],['Status','status'],['Warden Note','wardenNote']],
    complaints: [['Student ID','student.studentId'],['Student','student.name'],['Category','category'],['Subject','subject'],['Priority','priority'],['Status','status'],['Resolution','resolution']],
    visitors: [['Student','student.name'],['Visitor','visitorName'],['Relation','relation'],['Phone','phone'],['Visit Date','visitDate'],['Time','visitTime'],['Purpose','purpose'],['Status','status']]
  }[type];
  const getNested = (obj, key) => key.split('.').reduce((value, part) => value?.[part], obj);
  sheet.columns = columns.map(([header, key]) => ({ header, key, width: Math.max(14, header.length + 4) }));
  rows.forEach((row) => {
    const mapped = {};
    columns.forEach(([, key]) => {
      let value = getNested(row, key);
      if (value instanceof Date || /Date$|^createdAt$|^paidAt$/.test(key)) value = value ? new Date(value) : '';
      if (typeof value === 'boolean') value = value ? 'Active' : 'Inactive';
      mapped[key] = value ?? '';
    });
    sheet.addRow(mapped);
  });
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B7C6C' } };
  sheet.getRow(1).height = 24;
  sheet.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + columns.length)}${Math.max(1, rows.length + 1)}` };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.eachRow((row, rowNumber) => { if (rowNumber > 1 && rowNumber % 2 === 0) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="smartstay-${type}-${new Date().toISOString().slice(0, 10)}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0 }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that unique value already exists.' });
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

async function seedMongo() {
  const count = await Models.User.countDocuments();
  if (count) return;
  console.log('Empty MongoDB database detected — creating demo records…');
  await seedMemory();
  const roomMap = {};
  for (const room of memory.rooms) {
    const { _id, ...payload } = room;
    const created = await Models.Room.create(payload);
    roomMap[_id] = created._id;
  }
  const userMap = {};
  for (const user of memory.users) {
    const { _id, roomId, ...payload } = user;
    const created = await Models.User.create({ ...payload, roomId: roomId ? roomMap[roomId] : null });
    userMap[_id] = created._id;
  }
  for (const collection of ['leaves', 'fees', 'complaints', 'visitors']) {
    for (const item of memory[collection]) {
      const { _id, studentId, ...payload } = item;
      await model(collection).create({ ...payload, studentId: userMap[studentId] });
    }
  }
}

async function start() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
      mongoMode = true;
      await seedMongo();
      console.log('✓ Connected to MongoDB Atlas');
    } catch (error) {
      console.warn(`⚠ MongoDB connection failed (${error.message}). Using demo data store instead.`);
      await seedMemory();
    }
  } else {
    await seedMemory();
    console.log('ℹ MONGODB_URI not configured — using auto-seeded demo data store');
  }
  app.listen(PORT, HOST, () => {
    console.log(`✓ SmartStay is running at http://${HOST}:${PORT}`);
    console.log('  Warden: warden@smartstay.edu / Warden@123');
    console.log('  Student: arun@smartstay.edu / Student@123');
  });
}

start();
