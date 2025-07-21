import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { clerkUserId, email, username, firstName, lastName, image } = await req.json();

    // Validate required fields
    if (!clerkUserId || !email || !username) {
      return NextResponse.json({
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Missing required fields: clerkUserId, email, and username are required',
        validation: {
          clerkUserId: !!clerkUserId,
          email: !!email,
          username: !!username
        }
      }, { status: 400 });
    }

    // Get MongoDB URI from environment
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      return NextResponse.json({
        success: false,
        timestamp: new Date().toISOString(),
        error: 'MONGODB_URI environment variable is not set',
        environment: {
          MONGODB_URI: !!MONGODB_URI
        }
      }, { status: 400 });
    }

    // Initialize MongoDB client
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });

    try {
      // Attempt to connect
      await client.connect();
      console.log('MongoDB connection successful');

      // Get database and collection
      const db = client.db('users');
      const collection = db.collection('users');

      // Prepare document to insert
      const document = {
        clerkUserId,
        email,
        username,
        firstName,
        lastName,
        image,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Attempt to insert
      const result = await collection.insertOne(document);
      console.log('Document inserted successfully');

      // Get the inserted document
      const insertedDoc = await collection.findOne({ _id: result.insertedId });

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Document inserted successfully',
        document: insertedDoc,
        connection: {
          database: 'users',
          collection: 'users',
          operation: 'insertOne'
        }
      }, { status: 201 });

    } catch (error) {
      console.error('MongoDB operation error:', error);
      const errorResponse = {
        success: false,
        timestamp: new Date().toISOString(),
        error: error.message,
        operation: 'insertOne',
        details: {
          database: 'users',
          collection: 'users'
        }
      };

      // Add error stack if in development
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = error.stack;
      }

      return NextResponse.json(errorResponse, { status: 400 });
    } finally {
      // Clean up
      await client.close();
      console.log('MongoDB connection closed');
    }

  } catch (error) {
    console.error('Request processing error:', error);
    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message,
      details: {
        stage: 'request_processing'
      }
    };

    // Add error stack if in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = error.stack;
    }

    return NextResponse.json(errorResponse, { status: 400 });
  }
}

// Enable body parsing
export const config = {
  api: {
    bodyParser: true
  }
};
