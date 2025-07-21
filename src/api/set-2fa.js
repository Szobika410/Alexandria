import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../lib/models/User';

export const config = {
  api: {
    bodyParser: true
  }
};

export default authMiddleware(async function handler(req, res) {
  try {
    // Validate request method
    if (req.method !== 'PATCH') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Get Clerk session
    const { userId } = req.auth;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const { clerkUserId, username, is2FAEnabled } = await req.json();

    // Validate required fields
    if (!clerkUserId || !username || typeof is2FAEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: clerkUserId, username, is2FAEnabled' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Find and update user
    const user = await User.findOneAndUpdate(
      { 
        $or: [
          { clerkUserId },
          { username }
        ] 
      },
      { 
        $set: { 
          is2FAEnabled,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: '2FA status updated successfully',
        is2FAEnabled: user.is2FAEnabled 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating 2FA status:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
});
