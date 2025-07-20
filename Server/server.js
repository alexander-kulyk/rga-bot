import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5002;
const DB_HOST = process.env.DB_HOST;

if (!DB_HOST) {
  console.error('❌ DB_HOST environment variable is required');
  process.exit(1);
}

// MongoDB connection configuration
mongoose.set('strictQuery', false); // Disable strict query mode

mongoose
  .connect(DB_HOST) // Connect to the MongoDB database using the connection string from environment variables
  .then(() => {
    console.log('🗄️ The database is connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

export default app;
