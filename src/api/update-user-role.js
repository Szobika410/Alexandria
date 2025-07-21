import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Request body validation schema
const roleUpdateSchema = z.object({
  clerkUserId: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/),
  username: z.string().min(3).max(30).regex(/^[a-z0-9._-]+$/),
  roles: z.array(z.enum(['user', 'admin', 'moderator'])).min(1)
});

const logEvent = (type, data, status = 'info', error = null) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const baseMessage = `Role Update - ${status.toUpperCase()} - Type: ${type}`;
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

export async function PATCH(req) {
  try {
    // Verify Clerk authentication
    const { userId, user } = getAuth(req);
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
      const validatedData = roleUpdateSchema.parse(body);
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
    logEvent('role_update', validatedData, 'info');

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

    // Update user roles
    try {
      // Get the requesting user's role level
      const requestingUser = await User.findOne({ clerkUserId: userId });
      if (!requestingUser) {
        throw new Error('Requesting user not found');
      }

      // Update user roles with permission check
      const updatedUser = await User.updateUserRoles(validatedData, requestingUser);
      logEvent('role_update', updatedUser, 'success');

      return NextResponse.json({
        success: true,
        message: 'User roles updated successfully',
        user: {
          id: updatedUser._id,
          clerkUserId: updatedUser.clerkUserId,
          username: updatedUser.username,
          roles: updatedUser.roles,
          permissions: updatedUser.permissions,
          updatedAt: updatedUser.updatedAt
        }
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    } catch (error) {
      logEvent('role_update', validatedData, 'error', error);
      throw error;
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Role update error:`, {
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
