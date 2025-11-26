'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isClient, setIsClient] = useState(false);
  const login = useLogin();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && localStorage.getItem('token')) {
      router.push('/admin/dashboard');
    }
  }, [isClient, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(credentials, {
      onSuccess: () => {
        router.push('/admin/dashboard');
      },
    });
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:purple-blue-500"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {login.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}