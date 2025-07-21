import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';

const batchSize = 1000; // Process users in batches for better performance

export async function POST(req) {
  try {
    await dbConnect();

    const clerkUsers = await fetch('https://api.clerk.dev/v1/users', {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    }).then(res => res.json());

    if (!clerkUsers.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch Clerk users: ' + clerkUsers.errors[0].message
      }, { status: 500 });
    }

    const totalUsers = clerkUsers.data.length;
    const syncResults = [];
    const startTime = Date.now();

    // Process users in batches
    for (let i = 0; i < totalUsers; i += batchSize) {
      const batch = clerkUsers.data.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (clerkUser) => {
          try {
            const userData = {
              clerkUserId: clerkUser.id,
              email: clerkUser.email_addresses?.[0]?.email_address || '',
              firstName: clerkUser.first_name,
              lastName: clerkUser.last_name,
              image: clerkUser.profile_image_url
            };

            const user = await User.findOneAndUpdate(
              { clerkUserId: userData.clerkUserId },
              { ...userData, updatedAt: new Date() },
              { upsert: true, new: true, runValidators: true }
            );

            return {
              id: userData.clerkUserId,
              status: 'updated',
              user
            };
          } catch (error) {
            console.error(`Error syncing user ${clerkUser.id}:`, error);
            return {
              id: clerkUser.id,
              status: 'error',
              error: error.message
            };
          }
        })
      );

      syncResults.push(...batchResults);
    }

    const summary = {
      totalSynced: syncResults.length,
      totalCreated: syncResults.filter(r => r.status === 'created').length,
      totalUpdated: syncResults.filter(r => r.status === 'updated').length,
      totalFailed: syncResults.filter(r => r.status === 'error').length,
      duration: Math.round((Date.now() - startTime) / 1000) + 's'
    };

    console.log(`Sync completed. Processed ${totalUsers} users in ${summary.duration}`);

    return NextResponse.json({
      success: true,
      message: 'User synchronization completed',
      summary,
      results: syncResults
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      error: error.stack
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }
}
