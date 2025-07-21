import mongoose from "mongoose";
import { dbConnect } from "./mongoose";

async function testMongoConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Connect to MongoDB
    await dbConnect();
    console.log("MongoDB connection successful!");

    // Create a test schema
    const TestSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });

    // Create model
    const Test = mongoose.model('Test', TestSchema);

    // Create test document
    const testDoc = new Test({ test: 'Clerk test' });
    await testDoc.save();
    console.log("Test document created successfully!");

    // Find and log the document
    const foundDoc = await Test.findOne({ test: 'Clerk test' });
    console.log("Found document:", foundDoc);

    // Clean up
    await Test.deleteMany({});
    console.log("Test document deleted successfully!");

    return { success: true, message: "MongoDB connection and operations successful" };
  } catch (error) {
    console.error("MongoDB test error:", error);
    return { success: false, message: error.message };
  }
}

// Run the test
if (import.meta.url === new URL(import.meta.url).href) {
  testMongoConnection().then(result => {
    console.log("Test result:", result);
  });
}

export default testMongoConnection;
