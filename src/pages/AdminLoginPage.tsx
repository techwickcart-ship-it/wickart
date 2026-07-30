import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { navigateTo } from '../lib/navigation';

export function AdminLoginPage({ onLogin, onBack }: { onLogin: () => void; onBack?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigateTo('/');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin();
    } else {
      setError('Please enter username and password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      {/* Top Header / Back Button Bar */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <button
          onClick={handleBack}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-200/90 shadow-sm hover:shadow transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Store</span>
        </button>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12 sm:mt-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-900/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-1">Sign in to access the control panel.</p>
        </div>
        <Card className="shadow-xl shadow-slate-200/50 border-0">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all font-medium text-slate-700" 
                  placeholder="Enter username" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all font-medium text-slate-700" 
                  placeholder="••••••••" 
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                Login to Admin <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                type="button" 
                onClick={handleBack}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to Storefront
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
