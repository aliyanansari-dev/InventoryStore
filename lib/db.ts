import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("bufferCommands", false);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  // If no external MONGODB_URI is provided or if pointing to localhost without mongod,
  // allow graceful fallback to in-memory store without crashing or hanging.
  if (!MONGODB_URI || MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1")) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 2000,
      })
      .then((instance) => {
        return instance;
      })
      .catch((err) => {
        console.warn("[AI Studio] MongoDB connection skipped/failed, in-memory store active:", err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export default connectToDatabase;
