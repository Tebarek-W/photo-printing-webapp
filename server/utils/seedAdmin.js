import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@josi.com' });
    
    if (adminExists) {
      console.log('ℹ️  Admin user already exists');
      process.exit();
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@josi.com',
      phone: '+1234567890',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@josi.com',
      phone: '+1234567891',
      password: 'user123',
      role: 'user'
    });

    console.log('✅ Test user created successfully:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role
    });
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedAdmin();