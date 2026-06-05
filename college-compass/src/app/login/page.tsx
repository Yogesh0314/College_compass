'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
            <Compass className="h-7 w-7" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500">
            {isLogin ? 'Sign in to your account' : 'Start your college journey today'}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-gray-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? "Don&apos;t have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-blue-600 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
