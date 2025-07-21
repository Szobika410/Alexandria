import mongoose from 'mongoose';

async function testMongoConnection() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error('MONGODB_URL environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connection successful!');

    // Create a test collection
    const TestSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });

    const Test = mongoose.model('Test', TestSchema);

    // Create a test document
    const testDoc = new Test({ test: 'ESM test' });
    await testDoc.save();
    console.log('Test document created successfully!');

    // Find the document
    const foundDoc = await Test.findOne({ test: 'ESM test' });
    console.log('Found document:', foundDoc);

    // Clean up
    await Test.deleteMany({});
    console.log('Test document deleted successfully!');

    // Close connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');

    return { success: true, message: 'MongoDB connection and operations successful' };
  } catch (error) {
    console.error('MongoDB test error:', error);
    return { success: false, message: error.message };
  }
}

// Run the test
if (import.meta.url === new URL(import.meta.url).href) {
  testMongoConnection().then(result => {
    console.log('Test result:', result);
  });
}
