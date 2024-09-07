import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// console.log('Mongo URI:', process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('mongo connected successfully');
  } catch (error) {
    console.error('mongo connection error:', error);
    process.exit(1);
  }
};

// connectDB();

export default connectDB;
