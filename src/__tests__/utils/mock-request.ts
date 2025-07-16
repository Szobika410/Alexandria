import { Headers } from 'node-fetch';

export function createMockRequest({
  headers = {},
  body = {},
}: {
  headers?: Record<string, string>;
  body?: any;
}) {
  return {
    headers: new Headers(headers),
    json: async () => body,
  };
}

export function createMockResponse() {
  const res = {
    json: jest.fn(),
    status: jest.fn(),
  };

  return res;
}
