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
    const client = new MongoClient(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await client.connect();
    console.log('MongoDB connection successful!');

    // Test if we can access the database
    const db = client.db('Alexandria');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);

    // Close connection
    await client.close();
    console.log('MongoDB connection closed.');

    return { success: true, message: 'MongoDB connection successful' };
  } catch (error) {
    console.error('MongoDB test error:', error);
    return { success: false, message: error.message };
  }
}

// Run the test
testMongoConnection().then(result => {
  console.log('Test result:', result);
});
