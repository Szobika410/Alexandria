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

    // Create a test schema
    const TestSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });

    // Create model
    const Test = mongoose.model('Test', TestSchema);

    // Create a test document
    console.log('Creating test document...');
    const testDoc = new Test({ test: 'Detailed test' });
    await testDoc.save();
    console.log('Test document created successfully!');

    // Find the document
    console.log('Finding test document...');
    const foundDoc = await Test.findOne({ test: 'Detailed test' });
    console.log('Found document:', foundDoc);

    // Update the document
    console.log('Updating test document...');
    foundDoc.test = 'Updated test';
    await foundDoc.save();
    console.log('Document updated successfully!');

    // Find the updated document
    console.log('Finding updated document...');
    const updatedDoc = await Test.findOne({ test: 'Updated test' });
    console.log('Updated document:', updatedDoc);

    // Clean up
    console.log('Cleaning up test document...');
    await Test.deleteMany({});
    console.log('Test document deleted successfully!');

    // Close connection
    console.log('Closing MongoDB connection...');
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');

    return { success: true, message: 'MongoDB connection and operations successful' };
  } catch (error) {
    console.error('MongoDB test error:', error);
    return { success: false, message: error.message };
  }
}

// Run the test
testMongoConnection().then(result => {
  console.log('Test result:', result);
});
