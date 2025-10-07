import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/josi-photo-printing';
    
    console.log(`🟡 Attempting to connect to MongoDB: ${mongoURI}`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MONGODB CONNECTION FAILED: ${error.message}`);
    console.log('💡 TROUBLESHOOTING:');
    console.log('   1. Make sure MongoDB is installed: https://www.mongodb.com/try/download/community');
    console.log('   2. Start MongoDB: sudo systemctl start mongod (Linux) or brew services start mongodb-community (Mac)');
    console.log('   3. Or use MongoDB Atlas (cloud) and update MONGO_URI in .env');
    process.exit(1);
  }
};

export default connectDB;