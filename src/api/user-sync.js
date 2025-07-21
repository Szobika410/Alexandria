import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Request body validation schema
const userSyncSchema = z.object({
  clerkUserId: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/),
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9._-]+$/),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().url().optional()
});

const logEvent = (type, data, status = 'info', error = null) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const baseMessage = `User Sync - ${status.toUpperCase()} - Type: ${type}`;
  const userId = data?.clerkUserId || 'unknown';
  
  console.log(`${timestamp} ${baseMessage}`);
  console.log(`User ID: ${userId}`);
  
  if (error) {
    console.error(`${timestamp} Error:`, {
      message: error.message,
      stack: error.stack,
      type: error.name,
      code: error.code
    });
  }
};

export async function POST(req) {
  try {
    // Verify Clerk authentication
    const { userId } = getAuth(req);
    if (!userId) {
      logEvent('auth', {}, 'error', new Error('Authentication required'));
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
        error: {
          code: 'AUTH_REQUIRED',
          details: 'Valid Clerk authentication token required'
        }
      }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    }

    // Parse and validate request body
    try {
      const body = await req.json();
      const validatedData = userSyncSchema.parse(body);
      logEvent('validation', validatedData, 'success');
    } catch (error) {
      if (error instanceof z.ZodError) {
        logEvent('validation', body, 'error', error);
        return NextResponse.json({
          success: false,
          message: 'Invalid request data',
          error: {
            code: 'INVALID_DATA',
            details: error.errors
          }
        }, { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
          }
        });
      }
      throw error;
    }

    // Log request start
    logEvent('sync', validatedData, 'info');

    // Connect to MongoDB
    try {
      await dbConnect();
      logEvent('db', {}, 'success');
    } catch (error) {
      logEvent('db', {}, 'error', error);
      return NextResponse.json({
        success: false,
        message: 'Database connection error',
        error: {
          code: 'DB_ERROR',
          details: error.message
        }
      }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    }

    // Sync user data
    try {
      const user = await User.syncUser(validatedData);
      logEvent('sync', user, 'success');

      return NextResponse.json({
        success: true,
        message: 'User sync successful',
        user: {
          id: user._id,
          clerkUserId: user.clerkUserId,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          status: user.status,
          roles: user.roles,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin
        }
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    } catch (error) {
      logEvent('sync', validatedData, 'error', error);
      throw error;
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] User sync error:`, {
      message: error.message,
      stack: error.stack,
      type: error.name,
      code: error.code
    });
    
    // Log error
    logEvent('error', error, 'error', error);

    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error',
      error: {
        code: error.code || 'INTERNAL_ERROR',
        details: error.message,
        type: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { 
      status: error.status || 400,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }
}
