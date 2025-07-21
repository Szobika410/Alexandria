require('dotenv').config();

console.log('Environment variables loaded:');
console.log('MONGODB_URL:', process.env.MONGODB_URL);
console.log('CLERK_WEBHOOK_SECRET:', process.env.CLERK_WEBHOOK_SECRET);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
