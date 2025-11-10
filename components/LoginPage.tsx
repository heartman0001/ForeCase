
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, LockIcon, MailIcon } from './icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email);
    }
  };
  
  const handleGoogleLogin = () => {
    // In a real app, this would trigger the Google OAuth flow.
    // Here, we'll just log in with a mock Google email.
    login('user@google.com');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to WeWebPlus</h1>
          <p className="mt-2 text-gray-600">Sign in to your account.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleEmailLogin}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2826a9] focus:border-transparent"
              placeholder="Email address"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2826a9] focus:border-transparent"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2826a9] hover:bg-[#22208a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2826a9] transition duration-150"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2826a9] transition duration-150"
          >
            <GoogleIcon className="h-5 w-5 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;