import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function SecureAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    accessCode: '',
    password: ''
  });

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password, accessCode: formData.accessCode };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      console.log('Authentication successful:', data);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <header className="bg-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-zinc-500" />
            <div>
              <span className="text-zinc-300 text-lg font-medium">Secure Communication Network</span>
              <span className="text-zinc-600 text-xs block">Authentication System</span>
            </div>
          </div>
          <div className="text-zinc-600 text-sm">
            v3.2.1
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded px-4 py-3 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-zinc-300 text-sm mb-1">Notice</p>
              <p className="text-zinc-500 text-xs">This system is restricted to authorized users. All access attempts are logged.</p>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="bg-zinc-850 border-b border-zinc-700 px-6 py-4">
              <h1 className="text-zinc-200 text-lg font-medium">
                {isLogin ? 'System Access' : 'User Registration'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                {isLogin ? 'Enter your credentials' : 'Create a new account'}
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-zinc-400 text-sm mb-2 block">
                      Access Code
                    </label>
                    <input
                      type="text"
                      name="accessCode"
                      value={formData.accessCode}
                      onChange={handleChange}
                      placeholder="Enter your access code"
                      disabled={loading}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-2.5 rounded focus:border-zinc-500 focus:outline-none transition placeholder-zinc-600 disabled:opacity-50"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-zinc-400 text-sm mb-2 block">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-2.5 rounded focus:border-zinc-500 focus:outline-none transition placeholder-zinc-600 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-sm mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      disabled={loading}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-2.5 rounded focus:border-zinc-500 focus:outline-none transition placeholder-zinc-600 pr-12 disabled:opacity-50"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                      <input type="checkbox" className="bg-zinc-900 border-zinc-700 rounded" disabled={loading} />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-zinc-400 hover:text-zinc-300">
                      Forgot password
                    </a>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100 py-2.5 rounded font-medium transition-all border border-zinc-600 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-700 text-center">
                <p className="text-zinc-500 text-sm">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    disabled={loading}
                    className="text-zinc-300 hover:text-zinc-200 disabled:opacity-50"
                  >
                    {isLogin ? 'Register' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-zinc-600 text-xs">
              All connections are encrypted and secured
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-zinc-600">
              © 2024 Secure Communication Network. All rights reserved.
            </p>
            <div className="flex gap-6 text-zinc-600">
              <a href="#" className="hover:text-zinc-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}