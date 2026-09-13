import mongoose from 'mongoose';

export const connectDB = async (): Promise<typeof mongoose | null> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crowdwise';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.error('[MongoDB] Connection error:', error.message || error);
    // Do not call process.exit(1) so the HTTP server stays alive and reports health
    return null;
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
