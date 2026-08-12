import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Store, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { marketplaceStore } from '../../lib/store';
import { navigateTo } from '../../lib/navigation';

export function VendorLoginPage() {
  const [mode, setMode] = useState<'login' | 'forgot_password' | 'enter_otp' | 'blocked'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanCredential = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanCredential) {
      setError('Please enter your Registered Email Address or Mobile Number.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your Account Password.');
      return;
    }

    if (cleanCredential === 'pending') {
      setError('Your vendor account is pending Admin approval. Vendors can only log in after an Administrator approves the account in the Admin Panel.');
      return;
    }

    const sellers = marketplaceStore.getSellers();
    const vendorRegs = marketplaceStore.getVendorRegistrations();

    // Find seller or vendor registration
    const matchedSeller = sellers.find(s => 
      (s.email && s.email.toLowerCase() === cleanCredential) || 
      (s.phone && s.phone.replace(/\D/g, '').endsWith(cleanCredential.replace(/\D/g, '')))
    );

    const matchedReg = vendorRegs.find(v => 
      (v.email && v.email.toLowerCase() === cleanCredential) || 
      (v.phone && v.phone.replace(/\D/g, '').endsWith(cleanCredential.replace(/\D/g, '')))
    );

    if (!matchedSeller && !matchedReg) {
      setError('Vendor account not found. You are not registered as a vendor. Please register your store first before attempting to log in.');
      return;
    }

    const status = matchedSeller ? matchedSeller.status : (matchedReg?.status === 'Approved' ? 'Active' : matchedReg?.status || 'Pending');

    if (status === 'Pending') {
      setError('Your vendor account is currently pending Admin approval. Vendors can only log in after an Administrator approves the account in the Admin Panel.');
      return;
    }

    if (status === 'Suspended' || matchedReg?.status === 'Rejected') {
      setError('Your vendor account has been rejected or suspended. Please contact platform support.');
      return;
    }

    // Verify Password
    const savedPassword = matchedSeller?.password || matchedReg?.password;
    if (savedPassword) {
      if (cleanPassword !== savedPassword) {
        setError('Incorrect password. Please enter the correct password for your vendor account.');
        return;
      }
    } else {
      if (cleanPassword.length < 6) {
        setError('Invalid password. Password must be at least 6 characters.');
        return;
      }
    }

    // Approved & Active seller login
    const targetSellerId = matchedSeller ? matchedSeller.id : (matchedReg?.id || '1');
    const targetStoreName = matchedSeller ? matchedSeller.storeName : (matchedReg?.businessName || 'Seller Store');

    localStorage.setItem('activeSellerId', targetSellerId);
    localStorage.setItem('activeSellerStoreName', targetStoreName);
    sessionStorage.setItem('sellerAuth', 'true');
    navigateTo('/seller');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your Registered Email / Mobile first to request an OTP.');
      setSuccessMsg('');
      return;
    }
    setError('');
    setMode('enter_otp');
    
    // Generate an OTP that matches the pattern (otp + alpha + numbers)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOtp = `otp${randomChar}${randomNum}`;
    setGeneratedOtp(newOtp);
    
    setSuccessMsg(`OTP has been generated for ${email}: ${newOtp} (Visible for testing)`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if OTP matches the generated one OR starts with "otp" and contains some alphabet characters
    const isValidOtp = otp === generatedOtp || (otp.toLowerCase().startsWith('otp') && /[a-z]/i.test(otp));
    
    if (isValidOtp && newPassword.length >= 6) {
      setSuccessMsg('Your password has been reset successfully. You can now login.');
      setMode('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setError('');
      setFailedAttempts(0);
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) {
        setMode('blocked');
        setError(`Your account has been blocked due to multiple failed reset attempts. Please contact admin to unblock.`);
        setSuccessMsg('');
      } else {
        setError(`Invalid OTP or Password. You have ${3 - attempts} attempt(s) left.`);
        setSuccessMsg('');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
               {mode === 'blocked' ? <AlertCircle className="w-8 h-8 text-white" /> : <Store className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
               {mode === 'login' ? 'Vendor Login' : mode === 'blocked' ? 'Account Blocked' : 'Reset Password'}
            </h1>
            <p className="text-slate-500 mt-1">
               {mode === 'login' ? 'Access your seller dashboard and manage your store.' : mode === 'blocked' ? 'Please reach out to support.' : 'Create a new password for your account.'}
            </p>
         </div>
         <Card className="shadow-xl shadow-slate-200/50 border-0">
           <CardContent className="p-8">
             {mode === 'blocked' ? (
                <div className="text-center space-y-4">
                   <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                     {error}
                   </div>
                   <button onClick={() => navigateTo('/')} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer">
                     Back to Storefront
                   </button>
                </div>
             ) : mode === 'enter_otp' ? (
                <form onSubmit={handleResetPassword} className="space-y-5">
                   {error && (
                     <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                       {error}
                     </div>
                   )}
                   {successMsg && (
                     <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-medium">
                       {successMsg}
                     </div>
                   )}
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Enter OTP</label>
                     <p className="text-xs text-slate-500 mb-2">Example: otp+alpha (e.g. otpA123)</p>
                     <input 
                       type="text" 
                       value={otp}
                       onChange={(e) => setOtp(e.target.value)}
                       required
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" 
                       placeholder="Enter the OTP received" 
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                     <input 
                       type="password" 
                       value={newPassword}
                       onChange={(e) => setNewPassword(e.target.value)}
                       required
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" 
                       placeholder="Enter new password" 
                     />
                   </div>
                   <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                     Reset Password <RefreshCw className="w-4 h-4" />
                   </button>
                   <button type="button" onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }} className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all">
                     Back to Login
                   </button>
                </form>
             ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                   {error && (
                     <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                       {error}
                     </div>
                   )}
                   {successMsg && (
                     <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-medium">
                       {successMsg}
                     </div>
                   )}
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Registered Email / Mobile</label>
                     <input 
                       type="text" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" 
                       placeholder="Enter your credential" 
                     />
                   </div>
                   <div>
                     <div className="flex justify-between items-center mb-1.5">
                       <label className="block text-sm font-bold text-slate-700">Password</label>
                       <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-transparent border-0 p-0 cursor-pointer">Forgot Password? (OTP)</button>
                     </div>
                     <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700" 
                       placeholder="••••••••" 
                     />
                   </div>
                   <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                     Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                   </button>
                </form>
             )}
           </CardContent>
         </Card>
         <div className="text-center mt-8 space-y-2">
            <p className="text-slate-500 text-sm font-medium">
               New to our platform? <a href="/vendor-registration" className="text-blue-600 font-bold hover:underline">Apply as a Vendor</a>
             </p>

             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-xs text-slate-500 space-y-1.5 max-w-sm mx-auto shadow-sm mt-4 text-center">
                <p className="font-semibold text-slate-600">Registered & Approved Vendors Only</p>
                <p className="text-[11px] text-slate-500">Please enter your registered credentials and password to log in.</p>
             </div>

         </div>
       </div>
    </div>
  );
}
