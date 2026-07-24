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
    if (email === 'pending') {
      setError('Your account is currently pending admin approval. You will receive WhatsApp notification once approved.');
      setSuccessMsg('');
      return;
    }

    const sellers = marketplaceStore.getSellers();
    const matched = sellers.find(s => s.email.toLowerCase() === email.trim().toLowerCase());

    if (matched) {
      localStorage.setItem('activeSellerId', matched.id);
      localStorage.setItem('activeSellerStoreName', matched.storeName);
    } else {
      // Create a temporary store name if they login with any custom email, or select first
      const storeName = email.includes('@') ? email.split('@')[0].toUpperCase() + ' Store' : 'Custom Seller Store';
      const isNew = !sellers.some(s => s.email.toLowerCase() === email.trim().toLowerCase());
      if (isNew) {
        const newSeller = marketplaceStore.addSeller({
          name: email.split('@')[0],
          email: email.trim(),
          storeName: storeName,
          status: 'Active'
        });
        localStorage.setItem('activeSellerId', newSeller.id);
        localStorage.setItem('activeSellerStoreName', newSeller.storeName);
      } else {
        const defaultSeller = sellers[0] || { id: '1', storeName: 'City Square Mart' };
        localStorage.setItem('activeSellerId', defaultSeller.id);
        localStorage.setItem('activeSellerStoreName', defaultSeller.storeName);
      }
    }

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

             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-xs text-slate-500 space-y-1.5 max-w-sm mx-auto shadow-sm mt-4">
                <p className="font-bold text-slate-600">Demo Vendor Accounts (Use any password):</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="font-semibold text-blue-600">alok@citysquare.com</span> (City Square Mart)</li>
                  <li><span className="font-semibold text-blue-600">ravi@siliconvalley.com</span> (Silicon Valley Store)</li>
                  <li><span className="font-semibold text-blue-600">suhani@freshorganic.com</span> (Fresh Organic Foods)</li>
                  <li><span className="font-semibold text-blue-600">amit@groceryhub.com</span> (Amit Grocery Hub)</li>
                </ul>
                <p className="italic text-[10px] text-slate-400 mt-1">Or sign in with any other email to automatically generate a custom seller store.</p>
             </div>

         </div>
       </div>
    </div>
  );
}
