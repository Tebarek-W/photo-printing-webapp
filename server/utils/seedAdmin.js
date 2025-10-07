import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🟡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');

    // Clear existing demo users (optional)
    await User.deleteMany({ 
      email: { $in: ['admin@josi.com', 'user@josi.com'] } 
    });

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin Josi',
      email: 'adminjosi@gmail.com',
      phone: '+251942081178',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully:');
    console.log('   📧 Email: adminjosi@gmail.com');
    console.log('   🔑 Password: admin123');
    console.log('   👤 Role: admin');

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@josi.com',
      phone: '+1234567891',
      password: 'user123',
      role: 'user'
    });

    console.log('✅ Test user created successfully:');
    console.log('   📧 Email: user@josi.com');
    console.log('   🔑 Password: user123');
    console.log('   👤 Role: user');

    console.log('\n🎉 Demo users created successfully!');
    console.log('📍 You can now use these accounts to login.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedAdmin();