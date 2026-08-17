import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LifeBuoy, Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, Send, X, ShieldAlert } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../../lib/store';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';

export function SellerSupportPage() {
  const { activeSellerStoreName, activeSellerId } = useActiveSellerStore();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payouts & Settlement');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [message, setMessage] = useState('');

  const tickets = useMarketplaceData('supportTickets', () => marketplaceStore.getSupportTickets());

  const storeTickets = tickets.filter(t => {
    if (!t.storeName) return true;
    return (
      t.storeName.toLowerCase() === activeSellerStoreName.toLowerCase() ||
      t.sellerId === activeSellerId ||
      t.storeName === 'City Square Mart'
    );
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    marketplaceStore.addSupportTicket({
      subject: subject.trim(),
      category,
      priority,
      message: message.trim(),
      storeName: activeSellerStoreName,
      sellerId: activeSellerId
    });

    setNotification('Support ticket created successfully! Our team will respond shortly.');
    setTimeout(() => setNotification(null), 4000);
    setIsNewModalOpen(false);
    setSubject('');
    setMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const list = marketplaceStore.getSupportTickets();
    const nowStr = new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    
    const updated = list.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          lastUpdated: nowStr,
          messages: [
            ...t.messages,
            { sender: 'seller' as const, message: replyMessage.trim(), timestamp: nowStr }
          ]
        };
      }
      return t;
    });

    marketplaceStore.saveSupportTickets(updated);
    const updatedTicket = updated.find(t => t.id === selectedTicket.id);
    if (updatedTicket) setSelectedTicket(updatedTicket);
    setReplyMessage('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-purple-600" />
            Vendor Helpdesk & Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit inquiries, request inventory additions, or get priority resolution for payouts and store issues.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Ticket</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {notification}
        </div>
      )}

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Active Support Tickets ({storeTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {storeTickets.length > 0 ? (
                storeTickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      selectedTicket?.id === t.id ? 'bg-purple-50/50 border-l-4 border-purple-600' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {t.ticketNo}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : t.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority} Priority
                        </span>
                        <span className="text-[11px] text-slate-400">• {t.category}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.subject}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {t.messages[t.messages.length - 1]?.message}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          t.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.lastUpdated.split(',')[0]}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <LifeBuoy className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No support tickets yet</p>
                  <p className="text-xs text-slate-400 mt-1">If you need any assistance, click "Raise New Ticket".</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Ticket Conversation Drawer/Card */}
        <div className="space-y-4">
          {selectedTicket ? (
            <Card className="border border-purple-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {selectedTicket.ticketNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{selectedTicket.subject}</h3>
                <p className="text-[11px] text-slate-500">Category: {selectedTicket.category}</p>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        m.sender === 'seller'
                          ? 'bg-purple-50 text-purple-950 ml-4 border border-purple-100'
                          : 'bg-slate-100 text-slate-900 mr-4 border border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold text-[10px] opacity-75">
                        <span>{m.sender === 'seller' ? 'You (Vendor)' : 'Wikcart Support Admin'}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Reply
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-6 bg-slate-100/70 border border-slate-200/80 rounded-2xl text-center text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-bold text-xs">Select a ticket on the left</p>
              <p className="text-[11px] text-slate-400">View complete conversation thread or submit an update.</p>
            </div>
          )}

          {/* Quick Help Contacts */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Emergency Vendor Support
            </h4>
            <p className="text-slate-500 text-[11px]">Direct priority line for urgent order dispatch or rider coordination:</p>
            <div className="pt-1 text-slate-800 font-semibold space-y-1 text-[11px]">
              <div>📞 Phone: +91 9876543210</div>
              <div>✉️ Email: sellersupport@wikcart.in</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-purple-600" />
                Raise New Support Ticket
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Brief summary of your query..."
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-500 font-medium"
                  >
                    <option>Payouts & Settlement</option>
                    <option>Order & Dispatch Issue</option>
                    <option>Catalog Management</option>
                    <option>KYC & Documents</option>
                    <option>Technical Bug</option>
                    <option>Other General Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-500 font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Details <span className="text-rose-500">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Please describe the issue or request in detail with any relevant order numbers..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
