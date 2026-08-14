const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

function classifyMongoError(error) {
  const message = (error && error.message) ? error.message : String(error);
  if (!message) return 'another MongoDB error';

  if (/ECONNREFUSED|ENOTFOUND|EAI_AGAIN|querySrv|SRV|DNS|host not found/i.test(message)) return 'DNS/SRV resolution problem';
  if (/Authentication|auth failed|login failed|invalid credentials|wrong password|not authorized|MongoServerError: .*auth/i.test(message)) return 'authentication failure';
  if (/timeout|timed out|socket hang up|client network socket disconnected|connection attempt failed/i.test(message)) return 'timeout/network access problem';
  if (/IP|not whitelisted|Whitelist|access from your current IP address|network access|connection refused/i.test(message)) return 'MongoDB Atlas IP/network access problem';
  if (/invalid connection string|mongodb uri|parse error|scheme|invalid scheme|options|bad auth|database name/i.test(message)) return 'invalid connection string';
  return 'another MongoDB error';
}

async function testConnection() {
  const uri = process.env.MONGODB_URI || '';

  if (!uri) {
    console.error('MONGODB_URI is not set.');
    process.exit(1);
  }

  console.log('Using MONGODB_URI from .env for the app and DB test.');
  console.log(`Hostname target: ${new URL(uri).hostname}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      retryWrites: false,
    });

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not ready.');
    }

    await db.admin().ping();
    console.log('MongoDB connection successful.');
    console.log(`Connected host: ${mongoose.connection.host}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    const category = classifyMongoError(error);
    console.error('MongoDB connection failed.');
    console.error(`Likely cause: ${category}`);
    console.error(`Raw error: ${error && error.message ? error.message : error}`);
    console.error('Check Atlas cluster status, network access, username/password, and the hostname format.');
    process.exit(1);
  }
}

testConnection();
