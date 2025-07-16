import { POST } from '@/app/api/webhooks/clerk/route';
import { createMockRequest, createMockResponse } from './utils/mock-request';

// Mock response object
type MockResponse = {
  json: jest.Mock;
  status: jest.Mock;
};

describe('Clerk Webhook Handler', () => {
  test('should handle user.created event successfully', async () => {
    const mockReq = createMockRequest({
      headers: {
        'x-clerk-signature': 't=1234567890,s=abc123def456'
      },
      body: {
        event: {
          type: 'user.created',
          data: {
            id: 'user_123',
            name: 'Test User',
            email_addresses: [{ email_address: 'test@example.com' }],
            image_url: 'https://example.com/avatar.jpg',
            first_name: 'Test',
            last_name: 'User'
          }
        }
      }
    });

    const mockRes = createMockResponse();

    process.env.WEBHOOK_SECRET = 'test-secret';
    process.env.CLERK_SECRET_KEY = 'test-clerk-key';

    await POST(mockReq);

    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test('should handle invalid signature', async () => {
    const mockReq = createMockRequest({
      headers: {},
      body: {}
    });

    const mockRes = createMockResponse();

    await POST(mockReq);

    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid request' });
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
