import React from 'react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Regisztráció</h1>
          <p className="mt-2 text-gray-600">Regisztrálj új fiókkal</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
