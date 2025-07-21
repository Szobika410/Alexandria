const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    console.log('MongoDB URL:', MONGODB_URL);
    
    if (!MONGODB_URL) {
      console.error('MONGODB_URL is not set');
      return;
    }

    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    console.log('MongoDB connection successful!');

    const db = client.db('Alexandria');
    const collection = db.collection('test');

    // Create a test document
    const result = await collection.insertOne({
      test: 'Direct test',
      timestamp: new Date()
    });
    console.log('Test document created successfully!', result);

    // Find the document
    const foundDoc = await collection.findOne({ test: 'Direct test' });
    console.log('Found document:', foundDoc);

    // Clean up
    await collection.deleteMany({});
    console.log('Test document deleted successfully!');

    // Close connection
    await client.close();
    console.log('MongoDB connection closed.');

    return { success: true, message: 'MongoDB connection and operations successful' };
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
