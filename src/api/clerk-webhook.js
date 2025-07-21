import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from 'next/server';

const logEvent = (type, data, status = 'info', error = null) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const baseMessage = `Clerk Webhook Event - ${status.toUpperCase()} - Type: ${type}`;
  const userId = data?.id || 'unknown';
  
  console.log(`${timestamp} ${baseMessage}`);
  console.log(`User ID: ${userId}`);
  
  if (error) {
    console.error(`${timestamp} Error:`, error);
  }
};

const handleUserEvent = async (type, data) => {
  const userData = {
    clerkUserId: data.id,
    email: data.email_addresses?.[0]?.email_address || '',
    image: data.image_url,
    firstName: data.first_name,
    lastName: data.last_name
  };

  switch (type) {
    case "user.created":
      return User.create(userData);
    case "user.updated":
      return User.findOneAndUpdate(
        { clerkUserId: userData.clerkUserId },
        { ...userData, updatedAt: new Date() },
        { new: true, upsert: true }
      );
    case "user.deleted":
      return User.findOneAndDelete({ clerkUserId: userData.clerkUserId });
    default:
      throw new Error('Unsupported event type');
  }
};

export async function POST(req) {
  try {
    const headerSignature = req.headers.get('x-clerk-signature');
    if (!headerSignature) {
      return NextResponse.json({
        success: false,
        message: 'Missing x-clerk-signature header'
      }, { status: 400 });
    }

    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        message: 'Invalid event structure'
      }, { status: 400 });
    }

    logEvent(type, data, 'received');
    await dbConnect();
    
    const result = await handleUserEvent(type, data);
    
    if (!result) {
      logEvent(type, data, 'error', 'Operation failed');
      return NextResponse.json({
        success: false,
        message: 'Operation failed'
      }, { status: 404 });
    }

    logEvent(type, data, 'success');
    
    return NextResponse.json({
      success: true,
      message: 'Operation successful',
      ...(result instanceof mongoose.Document ? { user: result } : {})
    }, { 
      status: type === 'user.created' ? 201 : 200 
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Webhook error:`, error);
    
    const status = error.message === 'Unsupported event type' ? 400 : 500;
    
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status });
  }
}

// Next.js-nek fontos: a bodyParser-t ACTIVIZÁLNI KELL custom JSON-hoz!
export const config = {
  api: {
    bodyParser: true, 
  },
};
