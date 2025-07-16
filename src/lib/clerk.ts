import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

export const clerkProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ClerkProvider, {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    children: children
  });
};

export default clerkProvider;
