import mongoose from 'mongoose';

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crowdwise';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB] Disconnection error:', error);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Lost MongoDB connection');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to MongoDB');
});
