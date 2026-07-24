import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle2, User, LogOut, ArrowRight, Lock, Phone } from 'lucide-react';
import { marketplaceStore } from '../lib/store';
import { navigateTo } from '../lib/navigation';

export function CustomerRegistrationPage() {
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isCustomerLoggedIn') === 'true';
  });
  const [savedName, setSavedName] = useState(() => {
    return localStorage.getItem('customerName') || 'John Doe';
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = fullName.trim() || 'John Doe';
    localStorage.setItem('isCustomerLoggedIn', 'true');
    localStorage.setItem('customerName', nameToSave);

    marketplaceStore.addCustomer({
      name: nameToSave,
      email: email.trim() || `${nameToSave.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: mobile.trim() || '+91 9000000000',
      address: [houseNo, street, city].filter(Boolean).join(', ') || 'India'
    });

    window.dispatchEvent(new Event('customerAuthUpdated'));
    setIsSubmitted(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = loginCredential.includes('@') 
      ? loginCredential.split('@')[0].toUpperCase() 
      : (loginCredential || 'Customer');
    localStorage.setItem('isCustomerLoggedIn', 'true');
    localStorage.setItem('customerName', nameToSave);
    setSavedName(nameToSave);

    marketplaceStore.addCustomer({
      name: nameToSave,
      email: loginCredential.includes('@') ? loginCredential : `${nameToSave.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: loginCredential.includes('@') ? '+91 9000000000' : loginCredential
    });

    setIsLoggedIn(true);
    window.dispatchEvent(new Event('customerAuthUpdated'));
  };

  const handleLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerUser');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('customerAuthUpdated'));
  };

  if (isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl shadow-xl border border-slate-200 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome, {savedName}!</h2>
        <p className="text-sm text-slate-500 mb-6">You are currently logged in as a Customer.</p>

        <div className="space-y-3">
          <button 
            onClick={() => navigateTo('/')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all border border-red-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Customer Account</span>
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center animate-in fade-in duration-500 p-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Registration Successful</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          You are now logged in as <strong className="text-slate-800">{localStorage.getItem('customerName') || 'John Doe'}</strong>. Start browsing and enjoy shopping!
        </p>
        <div className="flex gap-4 justify-center">
            <button onClick={() => navigateTo('/')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all cursor-pointer">
            Go to Storefront
            </button>
            <button onClick={() => setIsSubmitted(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">
            Back to Form
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 px-4 sm:px-0">
      {/* Tab switch header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Customer Account Login' : 'Customer Registration'}
          </h1>
          <p className="text-slate-500 mt-1">
            {mode === 'login' ? 'Log in to manage orders, wallet and saved addresses.' : 'Create a new customer account to start shopping.'}
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {mode === 'login' ? (
        <Card className="shadow-lg border-slate-200/60 font-sans max-w-md mx-auto">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number / Email</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    required 
                    type="text" 
                    value={loginCredential}
                    onChange={(e) => setLoginCredential(e.target.value)}
                    placeholder="e.g. john@example.com or +91 9000000000" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    required 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-blue-600 font-bold hover:underline bg-transparent border-0 cursor-pointer">
                  Register Now
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-slate-200/60 font-sans">
          <CardContent className="p-0">
             <form className="divide-y divide-slate-100 uppercase-labels" onSubmit={handleRegister}>
                {/* Personal Information */}
                <div className="p-6 md:p-8 space-y-6">
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Information
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-1 md:col-span-2">
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                         <input 
                           required 
                           type="text" 
                           value={fullName}
                           onChange={(e) => setFullName(e.target.value)}
                           placeholder="John Doe" 
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                         <input required type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 9000000000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                         <input required type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                         <input required type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                   </div>
                </div>

                {/* Delivery Address */}
                <div className="p-6 md:p-8 space-y-6">
                   <h3 className="text-lg font-bold text-slate-900">Delivery Address</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">House / Flat Number <span className="text-red-500">*</span></label>
                         <input required type="text" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Street / Area <span className="text-red-500">*</span></label>
                         <input required type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Landmark</label>
                         <input type="text" placeholder="Near XYZ Hospital" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                         <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                         <input required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">PIN Code <span className="text-red-500">*</span></label>
                         <input required type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                   </div>
                </div>

                {/* Referral Code Section */}
                <div className="p-6 md:p-8 space-y-6">
                   <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                     <div className="p-2 bg-emerald-100 rounded-full text-emerald-600 mt-0.5">
                       <CheckCircle2 className="w-5 h-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-emerald-800">Have a Referral Code?</h4>
                       <p className="text-sm font-medium text-emerald-700 mt-1">Sign up using a friend's referral code to instantly get ₹200 credited to your wallet for purchases!</p>
                     </div>
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Referral Code (Optional)</label>
                      <input type="text" placeholder="e.g. FRIEND200" className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase" />
                   </div>
                </div>

                {/* Terms & Submit */}
                <div className="p-6 md:p-8 space-y-4 bg-slate-50/50">
                   {[
                      'I agree to the Terms & Conditions',
                      'I agree to the Privacy Policy'
                   ].map((term, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer">
                         <input required type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                         <span className="text-sm font-medium text-slate-700">{term} <span className="text-red-500">*</span></span>
                      </label>
                   ))}
                   
                   <div className="pt-6 mt-4">
                      <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm mb-4 transition-colors">
                         Register Account
                      </button>
                      <p className="text-center text-sm font-medium text-slate-500">
                         Already have an account?{' '}
                         <button type="button" onClick={() => setMode('login')} className="text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-0 cursor-pointer">
                           Login
                         </button>
                      </p>
                   </div>
                </div>
             </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
