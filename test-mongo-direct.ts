import { MongoClient } from 'mongodb';

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
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('MongoDB connection successful!');

    // Test if we can access the database
    const db = client.db('Alexandria');
    console.log('Database name:', db.databaseName);

    // Test if we can create a collection
    console.log('Creating test collection...');
    await db.createCollection('test_collection');
    console.log('Collection created successfully!');

    // Insert a document
    console.log('Inserting document...');
    const result = await db.collection('test_collection').insertOne({
      test: 'Direct test',
      timestamp: new Date()
    });
    console.log('Document inserted with _id:', result.insertedId);

    // Find the document
    console.log('Finding document...');
    const foundDoc = await db.collection('test_collection').findOne({ test: 'Direct test' });
    console.log('Found document:', foundDoc);

    // Clean up
    console.log('Cleaning up test collection...');
    await db.collection('test_collection').drop();
    console.log('Test collection dropped successfully!');

    // Close connection
    console.log('Closing MongoDB connection...');
    await client.close();
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
