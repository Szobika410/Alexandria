const mongoose = require('mongoose');

async function testMongoConnection() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    console.log('MongoDB URL:', MONGODB_URL);
    
    if (!MONGODB_URL) {
      console.error('MONGODB_URL is not set');
      return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connection successful!');

    // Close connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');

    return { success: true, message: 'MongoDB connection successful' };
  } catch (error) {
    console.error('MongoDB test error:', error);
    return { success: false, message: error.message };
  }
}

// Run the test
if (require.main === module) {
  testMongoConnection().then(result => {
    console.log('Test result:', result);
  });
}
