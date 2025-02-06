import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in env file");
}

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = {
    connection: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  if (cachedConnection.connection) {
    return cachedConnection.connection;
  }

  if (!cachedConnection.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cachedConnection.promise = mongoose.connect(MONGODB_URI, options).then(() => mongoose.connection);
  }

  try {
    cachedConnection.connection = await cachedConnection.promise;
  } catch (error) {
    cachedConnection.promise = null;
    console.error("Error connecting to database : ", error);
  }

  return cachedConnection.connection;
}
