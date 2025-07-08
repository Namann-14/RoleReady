import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please provide with a mongodb uri");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function ConnectToDatabase() {
  // Already have a connection
  if (cached.conn) {
    return cached.conn;
  }

  // No connection, make a promise
  if (!cached.conn) {
    cached.promise = mongoose.connect(MONGODB_URI).then(() => {
      console.log("Connected to MongoDB");
      mongoose.connection;
    });
  }

  try {
    cached.conn = cached.promise;
  } catch (error) {
    cached.conn = null;
    return error;
  }

  return cached.conn;
}
