import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DollarSign, Wallet, ArrowUpRight, Plus, Clock, CheckCircle2, XCircle, AlertCircle, Building2, Smartphone, ShieldCheck, X } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerWithdrawalsPage() {
  const { activeSellerStoreName, activeSellerId, sellers } = useActiveSellerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [notification, setNotification] = useState<string | null>(null);

  // Form states
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'Bank Transfer' | 'UPI' | 'PayTM'>('Bank Transfer');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const withdrawals = useMarketplaceData('withdrawals', () => marketplaceStore.getWithdrawals());
  const currentSeller = sellers.find(s => s.id === activeSellerId || s.storeName === activeSellerStoreName);
  const currentWalletBalance = currentSeller ? (Number(currentSeller.walletBalance) || 0) : 0;

  // Filter withdrawals for this store
  const storeWithdrawals = useMemo(() => {
    return withdrawals.filter(w => {
      if (!w.store) return true;
      return (
        w.store.toLowerCase() === activeSellerStoreName.toLowerCase() ||
        w.sellerId === activeSellerId ||
        w.store === 'City Square Mart' ||
        w.store === 'Main Store'
      );
    });
  }, [withdrawals, activeSellerStoreName, activeSellerId]);

  const parseAmount = (str: string) => {
    if (!str) return 0;
    const num = parseFloat(String(str).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return storeWithdrawals;
    return storeWithdrawals.filter(w => w.status === statusFilter);
  }, [storeWithdrawals, statusFilter]);

  const pendingAmount = useMemo(() => {
    return storeWithdrawals
      .filter(w => w.status === 'Pending')
      .reduce((sum, w) => sum + parseAmount(w.requestedAmt), 0);
  }, [storeWithdrawals]);

  const approvedAmount = useMemo(() => {
    return storeWithdrawals
      .filter(w => w.status === 'Approved')
      .reduce((sum, w) => sum + parseAmount(w.requestedAmt), 0);
  }, [storeWithdrawals]);

  const handleSubmitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid withdrawal amount greater than ₹0.');
      return;
    }

    if (numAmount < 100) {
      setFormError('Minimum withdrawal threshold is ₹100.');
      return;
    }

    let accountDetailsStr = '';
    if (payoutMethod === 'Bank Transfer') {
      if (!accountNumber.trim() || !ifscCode.trim()) {
        setFormError('Account number and IFSC code are required for Bank Transfer.');
        return;
      }
      accountDetailsStr = `${bankName || 'Bank'} A/C: ${accountNumber} (IFSC: ${ifscCode.toUpperCase()})`;
    } else if (payoutMethod === 'UPI') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setFormError('Please provide a valid UPI ID (e.g. yourname@oksbi).');
        return;
      }
      accountDetailsStr = `UPI VPA: ${upiId.trim()}`;
    } else {
      if (!accountNumber.trim()) {
        setFormError('Please provide your PayTM registered mobile number.');
        return;
      }
      accountDetailsStr = `PayTM: ${accountNumber.trim()}`;
    }

    // Add withdrawal
    marketplaceStore.addWithdrawal({
      store: activeSellerStoreName,
      sellerId: activeSellerId,
      requestedAmt: `₹${numAmount.toFixed(2)}`,
      method: payoutMethod,
      accountDetails: accountDetailsStr,
      remarks: remarks || 'Vendor settlement payout request'
    });

    setNotification(`Payout request of ₹${numAmount.toFixed(2)} successfully submitted for Admin approval!`);
    setTimeout(() => setNotification(null), 5000);
    setIsModalOpen(false);
    setAmount('');
    setAccountNumber('');
    setIfscCode('');
    setUpiId('');
    setRemarks('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            Wallet & Payout Withdrawals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Request payouts directly to your registered bank account or UPI VPA for <strong className="text-slate-700">{activeSellerStoreName}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Withdrawal</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {notification}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Wallet Balance */}
        <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-md shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Available Balance</span>
            <div className="p-2 bg-white/10 rounded-xl">
              <Wallet className="w-4 h-4 text-blue-100" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-3">₹{currentWalletBalance.toFixed(2)}</p>
          <p className="text-xs text-blue-100/90 mt-1">Ready for settlement payout</p>
        </div>

        {/* Pending Withdrawals */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payouts</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-3">₹{pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-amber-700 mt-1">Under verification by Admin</p>
        </div>

        {/* Total Settled */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Settled / Paid</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-3">₹{approvedAmount.toFixed(2)}</p>
          <p className="text-xs text-emerald-700 mt-1">Successfully transferred to bank</p>
        </div>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Withdrawal History & Requests
            </CardTitle>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Request ID</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Requested Amount</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Payout Method</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Destination Account</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 font-bold uppercase text-[11px] tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.length > 0 ? (
                  filtered.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-slate-900 font-mono text-xs">{w.id}</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs">{w.date}</td>
                      <td className="px-4 sm:px-6 py-4 font-black text-slate-900 font-mono text-sm">
                        {w.requestedAmt}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 text-xs font-semibold">
                          {w.method === 'UPI' ? <Smartphone className="w-3 h-3 text-purple-600" /> : <Building2 className="w-3 h-3 text-blue-600" />}
                          {w.method}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700 text-xs font-mono max-w-xs truncate" title={w.accountDetails}>
                        {w.accountDetails || 'Primary Bank Account'}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            w.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {w.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                          {w.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {w.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-400 text-xs truncate max-w-xs">
                        {w.remarks || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <Wallet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700">No withdrawal records found</p>
                      <p className="text-xs text-slate-400 mt-1">Submit your first withdrawal request whenever you have wallet balance.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Withdrawal Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Request New Payout Withdrawal
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="100"
                    placeholder="Enter amount (Min ₹100)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payout Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Bank Transfer', 'UPI', 'PayTM'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPayoutMethod(method)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        payoutMethod === method
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {payoutMethod === 'Bank Transfer' ? (
                <div className="space-y-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank, SBI, ICICI"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Number <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter bank account number"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">IFSC Code <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234"
                      value={ifscCode}
                      onChange={e => setIfscCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono uppercase"
                      required
                    />
                  </div>
                </div>
              ) : payoutMethod === 'UPI' ? (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">UPI ID (VPA) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. storename@oksbi / 9876543210@paytm"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">PayTM Mobile Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Notes for the settlement team..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
