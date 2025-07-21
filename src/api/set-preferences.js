import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Request body validation schema
const preferencesSchema = z.object({
  clerkUserId: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/),
  username: z.string().min(3).max(30).regex(/^[a-z0-9._-]+$/),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.enum(['hu', 'en']).optional(),
    emailNotifications: z.boolean().optional(),
    dateFormat: z.string().optional(),
    timeFormat: z.enum(['12h', '24h']).optional(),
    timezone: z.string().optional(),
    showActivity: z.boolean().optional(),
    showOnlineStatus: z.boolean().optional()
  }).min(1) // At least one preference must be provided
});

const logEvent = (type, data, status = 'info', error = null) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const baseMessage = `Preferences Update - ${status.toUpperCase()} - Type: ${type}`;
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
      const validatedData = preferencesSchema.parse(body);
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
    logEvent('preferences_update', validatedData, 'info');

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

    // Update preferences
    try {
      // Get the requesting user to check permissions
      const requestingUser = await User.findOne({ clerkUserId: userId });
      if (!requestingUser) {
        throw new Error('Requesting user not found');
      }

      // Check if user is trying to update someone else's preferences
      if (requestingUser.clerkUserId !== validatedData.clerkUserId) {
        // Check if user has permission to update other users' preferences
        if (!requestingUser.hasPermission('moderate')) {
          throw new Error('Insufficient permissions to update other users\' preferences');
        }
      }

      // Update preferences
      const result = await User.updatePreferences(validatedData);
      logEvent('preferences_update', result, 'success');

      return NextResponse.json({
        success: true,
        message: 'Preferences updated successfully',
        preferences: result.preferences
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    } catch (error) {
      logEvent('preferences_update', validatedData, 'error', error);
      throw error;
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Preferences update error:`, {
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
