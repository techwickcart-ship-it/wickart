import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { CheckCircle2, User, LogOut, ArrowRight, Lock, Phone, Loader2, Database, ShieldCheck, ShoppingBag } from 'lucide-react';
import { marketplaceStore } from '../lib/store';
import { navigateTo } from '../lib/navigation';

export function CustomerRegistrationPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [supabaseSaved, setSupabaseSaved] = useState<boolean>(true);
  const [lastSavedCustomer, setLastSavedCustomer] = useState<any>(null);

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Sultanpur');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('228001');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [registerAsVendor, setRegisterAsVendor] = useState(false);
  const [vendorStoreName, setVendorStoreName] = useState('');
  const [isStoreNameManual, setIsStoreNameManual] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [loginCredential, setLoginCredential] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isCustomerLoggedIn') === 'true';
  });
  const [savedName, setSavedName] = useState(() => {
    return localStorage.getItem('customerName') || 'Customer User';
  });

  const handleFullNameChange = (val: string) => {
    setFullName(val);
    if (!isStoreNameManual) {
      setVendorStoreName(val.trim() ? `${val.trim()}'s Store` : '');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your Full Name (at least 2 characters).');
      return;
    }
    
    const mobileDigits = mobile.replace(/\D/g, '');
    if (mobileDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit numeric Mobile Number (0-9 only, exactly 10 digits).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid Email Address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }
    if (!houseNo.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      setErrorMsg('Please fill in your complete delivery address (House No, Street, City, and PIN Code).');
      return;
    }

    const pinDigits = pincode.replace(/\D/g, '');
    if (pinDigits.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit numeric PIN Code (e.g. 228001).');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setErrorMsg('Please agree to both Terms & Conditions and Privacy Policy to create your account.');
      return;
    }

    setIsSubmitting(true);

    try {
      const nameToSave = fullName.trim();
      const effectiveStoreName = (vendorStoreName.trim() || `${nameToSave}'s Store`);
      const fullAddress = [houseNo.trim(), street.trim(), landmark.trim(), city.trim(), stateName.trim(), pinDigits].filter(Boolean).join(', ');

      const customerPayload = {
        name: nameToSave,
        email: email.trim().toLowerCase(),
        phone: mobileDigits,
        password: password,
        houseNo: houseNo.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pinDigits,
        address: fullAddress,
        referralCode: referralCodeInput.trim() || undefined,
        referredByCode: referralCodeInput.trim() || undefined,
        agreedTerms: agreeTerms,
        agreedPrivacy: agreePrivacy
      };

      // Asynchronously add to local store and save directly to Supabase
      const { customer, supabaseResult } = await marketplaceStore.addCustomerAsync(customerPayload);
      setLastSavedCustomer(customer);
      setSupabaseSaved(supabaseResult?.success !== false);

      localStorage.setItem('isCustomerLoggedIn', 'true');
      localStorage.setItem('customerName', nameToSave);
      localStorage.setItem('customerUser', JSON.stringify(customer));

      // Process referral reward if referral code provided
      if (referralCodeInput.trim()) {
        marketplaceStore.processReferralCode(
          referralCodeInput.trim(),
          nameToSave,
          mobileDigits,
          false,
          customer.id
        );
      }

      // If requested, also create vendor registration and seller account
      if (registerAsVendor) {
        marketplaceStore.addVendorRegistration({
          name: nameToSave,
          businessName: effectiveStoreName,
          email: email.trim().toLowerCase(),
          phone: mobileDigits,
          city: city.trim(),
          state: stateName.trim(),
          address: fullAddress,
          pincode: pinDigits,
          status: 'Pending'
        });
      }

      window.dispatchEvent(new Event('customerAuthUpdated'));
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setErrorMsg(err.message || 'Registration failed. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginCredential.trim()) {
      setErrorMsg('Please enter your Mobile Number or Email Address.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your Password.');
      return;
    }

    const cleanCred = loginCredential.trim();
    const customers = marketplaceStore.getCustomers();
    const matched = customers.find(c => 
      (c.email && c.email.toLowerCase() === cleanCred.toLowerCase()) || 
      (c.phone && c.phone.replace(/\D/g, '') === cleanCred.replace(/\D/g, ''))
    );

    const nameToSave = matched ? matched.name : (cleanCred.includes('@') ? cleanCred.split('@')[0].toUpperCase() : cleanCred);

    localStorage.setItem('isCustomerLoggedIn', 'true');
    localStorage.setItem('customerName', nameToSave);
    setSavedName(nameToSave);

    if (!matched) {
      marketplaceStore.addCustomer({
        name: nameToSave,
        email: cleanCred.includes('@') ? cleanCred : `${cleanCred.replace(/\D/g, '')}@customer.local`,
        phone: cleanCred.includes('@') ? '' : cleanCred.replace(/\D/g, '')
      });
    }

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
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all border border-red-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Customer Account</span>
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const cust = lastSavedCustomer || {};
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center animate-in fade-in duration-500 p-8 max-w-xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Registration Successful!</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-6">
          Account created for <strong className="text-slate-900">{cust.name || fullName}</strong>. You are logged in and ready to shop.
        </p>

        {/* Database Status & Profile Details Card */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left space-y-2.5 text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" /> Supabase Database
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Saved Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            <div><span className="text-slate-500">Customer Name:</span> <strong className="text-slate-900">{cust.name || fullName}</strong></div>
            <div><span className="text-slate-500">Mobile:</span> <strong className="text-slate-900">{cust.phone || mobile}</strong></div>
            <div className="col-span-2"><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{cust.email || email}</strong></div>
            <div className="col-span-2"><span className="text-slate-500">Delivery Address:</span> <span className="text-slate-800">{cust.address || `${houseNo}, ${street}, ${city}`}</span></div>
            {cust.referralCode && (
              <div className="col-span-2 bg-emerald-50 p-2 rounded-lg text-emerald-800 font-medium">
                🎁 Referral Code Generated: <strong className="font-mono">{cust.referralCode}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center w-full">
          <button onClick={() => navigateTo('/')} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Go to Storefront
          </button>
          <button onClick={() => { setIsSubmitted(false); setMode('login'); }} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all cursor-pointer">
            Go to Login
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
            {mode === 'login' ? 'Log in to manage orders, wallet and saved addresses.' : 'Create a new customer account to start shopping on Wikcart.'}
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

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
          <span>{errorMsg}</span>
        </div>
      )}

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
                    placeholder="e.g. 9876543210 or user@example.com" 
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
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => { setMode('register'); setErrorMsg(''); }} className="text-blue-600 font-bold hover:underline bg-transparent border-0 cursor-pointer">
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
                           onChange={(e) => handleFullNameChange(e.target.value)}
                           placeholder="Simran Kaur" 
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium" 
                         />
                      </div>
                      <div>
                         <div className="flex justify-between items-center mb-1.5">
                           <label className="block text-sm font-semibold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                           <span className="text-[11px] font-mono font-bold text-slate-500">{mobile.length}/10 Digits</span>
                         </div>
                         <input 
                           required 
                           type="tel" 
                           inputMode="numeric"
                           maxLength={10}
                           value={mobile} 
                           onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                           placeholder="e.g. 9876543210" 
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium font-mono" 
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                         <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="simran@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                         <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                         <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                   </div>
                </div>

                {/* Delivery Address */}
                <div className="p-6 md:p-8 space-y-6">
                   <h3 className="text-lg font-bold text-slate-900">Delivery Address</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">House / Flat Number <span className="text-red-500">*</span></label>
                         <input required type="text" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} placeholder="Flat 4B, Building 2" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Street / Area <span className="text-red-500">*</span></label>
                         <input required type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Civil Lines, Kadma" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">Landmark</label>
                         <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near XYZ Hospital" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                         <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                         <input required type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                         <div className="flex justify-between items-center mb-1.5">
                           <label className="block text-sm font-semibold text-slate-700">PIN Code <span className="text-red-500">*</span></label>
                           <span className="text-[11px] font-mono font-bold text-slate-500">{pincode.length}/6 Digits</span>
                         </div>
                         <input 
                           required 
                           type="text" 
                           inputMode="numeric"
                           maxLength={6}
                           value={pincode} 
                           onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                           placeholder="e.g. 228001"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium font-mono" 
                         />
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
                      <input type="text" value={referralCodeInput} onChange={(e) => setReferralCodeInput(e.target.value)} placeholder="e.g. FRIEND200" className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all uppercase font-mono font-bold" />
                   </div>
                </div>

                {/* Terms & Submit */}
                <div className="p-6 md:p-8 space-y-4 bg-slate-50/50">
                   <div className="space-y-3 bg-blue-50/80 border border-blue-200 p-4 rounded-xl">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={registerAsVendor}
                          onChange={(e) => setRegisterAsVendor(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <div>
                          <span className="text-sm font-bold text-blue-900 block">Also register my account as a Vendor / Seller</span>
                          <span className="text-xs text-blue-700 font-medium block">Your vendor profile will be submitted to Admin Panel for approval.</span>
                        </div>
                     </label>

                     {registerAsVendor && (
                       <div className="pt-2 pl-7 border-t border-blue-200/60 mt-2">
                         <label className="block text-xs font-bold text-blue-950 mb-1">
                           Store Display Name (Auto-fetched / Editable) *
                         </label>
                         <input 
                           type="text" 
                           value={vendorStoreName}
                           onChange={(e) => {
                             setIsStoreNameManual(true);
                             setVendorStoreName(e.target.value);
                           }}
                           placeholder="e.g. Simran's Mart"
                           className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-lg text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium"
                         />
                         <p className="text-[11px] text-blue-700 mt-1">Store name auto-fetched based on your full name or customized by you.</p>
                       </div>
                     )}
                   </div>

                   <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm font-medium text-slate-700">I agree to the Terms & Conditions <span className="text-red-500">*</span></span>
                   </label>

                   <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm font-medium text-slate-700">I agree to the Privacy Policy <span className="text-red-500">*</span></span>
                   </label>
                   
                   <div className="pt-6 mt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md mb-4 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                         {isSubmitting ? (
                           <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             <span>Saving to Supabase Database...</span>
                           </>
                         ) : (
                           <span>Register Account</span>
                         )}
                      </button>
                      <p className="text-center text-sm font-medium text-slate-500">
                         Already have an account?{' '}
                         <button type="button" onClick={() => setMode('login')} className="text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-0 cursor-pointer font-bold">
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

