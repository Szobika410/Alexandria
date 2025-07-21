import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error(
    'Please define the MONGODB_URL environment variable in Vercel dashboard'
  );
}

/**
 * Global connection cache a Vercel hot reload miatt!
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = await mongoose.connect(MONGODB_URL, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
