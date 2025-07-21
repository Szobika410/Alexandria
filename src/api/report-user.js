import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Report from '@/lib/models/Report';
import { z } from 'zod';
import validator from 'validator';

// Request body validation schema
const reportSchema = z.object({
  reportedClerkUserId: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/),
  reportedBy: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/),
  reason: z.enum([
    'spam',
    'harassment',
    'inappropriate_content',
    'fake_account',
    'other'
  ]),
  details: z.string().optional().max(500),
  timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/)
});

const logEvent = (type, data, status = 'info', error = null) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const baseMessage = `User Report - ${status.toUpperCase()} - Type: ${type}`;
  const reportId = data?._id || 'unknown';
  
  console.log(`${timestamp} ${baseMessage}`);
  console.log(`Report ID: ${reportId}`);
  
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
    // Parse and validate request body
    try {
      const body = await req.json();
      const validatedData = reportSchema.parse(body);
      
      // Additional validation for timestamp
      if (!validator.isISO8601(validatedData.timestamp)) {
        throw new Error('Invalid timestamp format. Must be ISO8601');
      }
      
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
    logEvent('report_create', validatedData, 'info');

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

    // Create report
    try {
      const result = await Report.createReport(validatedData);
      logEvent('report_create', result, 'success');

      return NextResponse.json({
        success: true,
        message: 'Report created successfully',
        report: result.report
      }, { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      });
    } catch (error) {
      logEvent('report_create', validatedData, 'error', error);
      throw error;
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Report creation error:`, {
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
