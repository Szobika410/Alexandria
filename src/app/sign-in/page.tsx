import React from 'react';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bejelentkezés</h1>
          <p className="mt-2 text-gray-600">Jelentkezz be a folytatáshoz</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
