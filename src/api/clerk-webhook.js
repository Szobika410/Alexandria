import { dbConnect } from '@/lib/mongoose'; // vagy: import { dbConnect } from '../../lib/mongoose';
import User from '@/models/User'; // vagy: import User from '../../models/User';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Svix header-ek:
  const svix_id = req.headers['svix-id'];
  const svix_signature = req.headers['svix-signature'];
  const svix_timestamp = req.headers['svix-timestamp'];

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return res.status(400).send('Missing Svix headers');
  }

  const wh = new Webhook(webhookSecret);

  let event;
  try {
    event = wh.verify(JSON.stringify(req.body), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  await dbConnect();

  const { id, email_addresses, first_name, last_name, username, profile_image_url } = event.data;

  if (event.type === 'user.created') {
    await User.create({
      clerkUserId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      username: username,
      image: profile_image_url,
    });
  } else if (event.type === 'user.updated') {
    await User.findOneAndUpdate(
      { clerkUserId: id },
      {
        $set: {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          username: username,
          image: profile_image_url,
        },
      },
      { upsert: true }
    );
  }

  res.status(200).json({ success: true });
}

// Next.js-nek fontos: a bodyParser-t ACTIVIZÁLNI KELL custom JSON-hoz!
export const config = {
  api: {
    bodyParser: true, // vagy bodyParser: { sizeLimit: "1mb" }
  },
};
