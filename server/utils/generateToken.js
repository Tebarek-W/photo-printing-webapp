import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Make sure we have a JWT secret
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error('❌ JWT_SECRET is not defined in environment variables');
    throw new Error('JWT secret is missing');
  }

  return jwt.sign(
    { id }, 
    jwtSecret,
    { 
      expiresIn: '30d' 
    }
  );
};

export default generateToken;