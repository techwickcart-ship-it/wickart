import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Shield, ArrowRight } from 'lucide-react';

export function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin();
    } else {
      setError('Please enter username and password');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('12345');
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                 onClick={handleQuickDemoLogin}
                 className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs cursor-pointer border border-slate-200"
               >
                 Quick Demo Login (admin / 12345)
               </button>
             </form>
           </CardContent>
         </Card>
       </div>
    </div>
  );
}
