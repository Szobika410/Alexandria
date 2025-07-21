import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

/**
 * Global connection cache a Vercel hot reload miatt!
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const opts = {
  bufferCommands: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 2,
  waitForConnections: true,
  retryWrites: true,
  retryReads: true,
  autoIndex: false,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  socketTimeoutMS: 0,
  heartbeatFrequencyMS: 10000,
  minHeartbeatFrequencyMS: 500,
  appname: 'Alexandria',
  readPreference: 'primary',
  readConcern: { level: 'local' },
  writeConcern: { w: 'majority', wtimeout: 1000 },
  compression: { zlibCompressionLevel: 9 }
};

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        mongoose.connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        mongoose.connection.on('disconnected', () => {
          console.log('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected');
        });
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
