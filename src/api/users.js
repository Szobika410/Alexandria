import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { z } from 'zod';

// Query parameter validation schema
const searchSchema = z.object({
  role: z.enum(['user', 'moderator', 'admin']).optional(),
  search: z.string().optional()
});

const logEvent = (type, data, status = 'info', error = null) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const baseMessage = `User Search - ${status.toUpperCase()} - Type: ${type}`;
  
  console.log(`${timestamp} ${baseMessage}`);
  console.log(`Query:`, data);
  
  if (error) {
    console.error(`${timestamp} Error:`, {
      message: error.message,
      stack: error.stack,
      type: error.name,
      code: error.code
    });
  }
};

export async function GET(req) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const query = {
      role: searchParams.get('role'),
      search: searchParams.get('search')
    };

    // Validate query parameters
    try {
      const validatedQuery = searchSchema.parse(query);
      logEvent('validation', validatedQuery, 'success');
    } catch (error) {
      if (error instanceof z.ZodError) {
        logEvent('validation', query, 'error', error);
        return NextResponse.json({
          success: false,
          message: 'Invalid query parameters',
          error: {
            code: 'INVALID_PARAMS',
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
    logEvent('user_search', query, 'info');

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

    // Search users
    try {
      const users = await User.searchUsers(validatedQuery);
      logEvent('user_search', { count: users.length }, 'success');

      return NextResponse.json({
        success: true,
        message: 'Users found successfully',
        users
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    } catch (error) {
      logEvent('user_search', query, 'error', error);
      throw error;
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] User search error:`, {
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
