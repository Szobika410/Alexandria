export const config = {
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    webhookSecret: process.env.WEBHOOK_SECRET,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
};

// Validate required environment variables
if (!config.clerk.secretKey) {
  throw new Error('CLERK_SECRET_KEY is required');
}

if (!config.clerk.webhookSecret) {
  throw new Error('WEBHOOK_SECRET is required');
}

if (!config.database.uri) {
  throw new Error('MONGODB_URI is required');
}
