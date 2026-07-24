import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Ticket, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  X, 
  Send, 
  FileText, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  lastUpdated: string;
  description: string;
  orderId?: string;
  replies: {
    sender: 'User' | 'Support Agent';
    name: string;
    message: string;
    timestamp: string;
  }[];
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-8042',
    subject: 'Delayed Payout Settlement for Order #ORD-9912',
    category: 'Payment & Payout',
    priority: 'High',
    status: 'In Progress',
    createdAt: '22 Jul 2026, 02:30 PM',
    lastUpdated: '23 Jul 2026, 11:15 AM',
    orderId: 'ORD-9912',
    description: 'The weekly automated wallet payout for order #ORD-9912 has not reflected in my HDFC bank account yet. Please check payment gateway logs.',
    replies: [
      {
        sender: 'User',
        name: 'Merchant Admin',
        message: 'The weekly automated wallet payout for order #ORD-9912 has not reflected in my HDFC bank account yet. Please check payment gateway logs.',
        timestamp: '22 Jul 2026, 02:30 PM'
      },
      {
        sender: 'Support Agent',
        name: 'Wikcart Finance Team',
        message: 'Hello, we have checked with our banking partner. The UTR reference number is HDFC9901823. Settlement should clear within 4 business hours.',
        timestamp: '23 Jul 2026, 11:15 AM'
      }
    ]
  },
  {
    id: 'TICK-8038',
    subject: 'GST Rate update request for Dairy products',
    category: 'Tax & Compliance',
    priority: 'Medium',
    status: 'Open',
    createdAt: '20 Jul 2026, 10:00 AM',
    lastUpdated: '20 Jul 2026, 10:00 AM',
    description: 'Need assistance updating the GST tax tier for newly added artisan cheese products to 5% instead of 12%.',
    replies: [
      {
        sender: 'User',
        name: 'Merchant Admin',
        message: 'Need assistance updating the GST tax tier for newly added artisan cheese products to 5% instead of 12%.',
        timestamp: '20 Jul 2026, 10:00 AM'
      }
    ]
  },
  {
    id: 'TICK-7990',
    subject: 'Store Address & Geofence Adjustment',
    category: 'Store & Inventory',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '15 Jul 2026, 04:15 PM',
    lastUpdated: '16 Jul 2026, 09:30 AM',
    description: 'Updated store pickup entrance address to Civil Lines Main Gate.',
    replies: [
      {
        sender: 'User',
        name: 'Merchant Admin',
        message: 'Updated store pickup entrance address to Civil Lines Main Gate.',
        timestamp: '15 Jul 2026, 04:15 PM'
      },
      {
        sender: 'Support Agent',
        name: 'Wikcart Ops',
        message: 'Address coordinates updated successfully in delivery radius mapping.',
        timestamp: '16 Jul 2026, 09:30 AM'
      }
    ]
  }
];

export function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('wikcart_support_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_TICKETS;
  });

  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Create Form State
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Order & Fulfillment');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [newOrderId, setNewOrderId] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Reply State
  const [replyText, setReplyText] = useState('');

  const saveTicketsToStorage = (updated: SupportTicket[]) => {
    setTickets(updated);
    localStorage.setItem('wikcart_support_tickets', JSON.stringify(updated));
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const now = new Date().toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true 
    });

    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(8000 + Math.random() * 1000)}`,
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'Open',
      createdAt: now,
      lastUpdated: now,
      orderId: newOrderId.trim() || undefined,
      description: newDescription.trim(),
      replies: [
        {
          sender: 'User',
          name: 'Merchant Admin',
          message: newDescription.trim(),
          timestamp: now
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    saveTicketsToStorage(updated);

    // Reset Form
    setNewSubject('');
    setNewCategory('Order & Fulfillment');
    setNewPriority('Medium');
    setNewOrderId('');
    setNewDescription('');
    setIsCreateModalOpen(false);

    setNotification(`Support ticket ${newTicket.id} created successfully! Our team will respond shortly.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    const now = new Date().toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true 
    });

    const newReply = {
      sender: 'User' as const,
      name: 'Merchant Admin',
      message: replyText.trim(),
      timestamp: now
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedTicket = {
          ...t,
          lastUpdated: now,
          status: t.status === 'Resolved' ? 'Open' : t.status,
          replies: [...t.replies, newReply]
        };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return t;
    });

    saveTicketsToStorage(updatedTickets);
    setReplyText('');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesTab = activeTab === 'All' || t.status === activeTab;
    const matchesSearch = 
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
           <ShieldCheck className="w-5 h-5 text-emerald-400" />
           <span className="font-medium text-sm">{notification}</span>
           <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" /> Support Desk
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Help & Ticket Management</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Submit support tickets for orders, settlements, KYC verification, or technical assistance.
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" /> Create New Ticket
        </button>
      </div>

      {/* Hero "Create Ticket" Action Card */}
      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-md shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Need Assistance with your Merchant Account?</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Create a formal support ticket to reach our compliance, finance, or technical operations teams. Every ticket is assigned a tracking reference ID.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0 w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Open Support Ticket</span>
          </button>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              Your Support Tickets ({filteredTickets.length})
            </CardTitle>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-slate-900 text-white font-bold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-blue-500 outline-none w-full sm:w-48"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                <tr>
                  <th className="px-6 py-4">Ticket Reference</th>
                  <th className="px-6 py-4">Subject & Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      No support tickets found matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {ticket.id}
                        </span>
                        {ticket.orderId && (
                          <p className="text-[11px] text-indigo-600 font-mono mt-1">Ref: {ticket.orderId}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{ticket.subject}</p>
                        <span className="text-xs text-slate-400 font-medium">{ticket.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status === 'Open' && <Clock className="w-3.5 h-3.5" />}
                          {ticket.status === 'In Progress' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {ticket.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {ticket.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          View & Reply <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Create Support Ticket</h3>
                  <p className="text-xs text-slate-400">Describe your issue for Wikcart operations team</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Issue with payout calculation for Order #ORD-8810"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Order & Fulfillment">Order & Fulfillment</option>
                    <option value="Payment & Payout">Payment & Payout</option>
                    <option value="KYC & Documents">KYC & Documents</option>
                    <option value="Store & Inventory">Store & Inventory</option>
                    <option value="Tax & Compliance">Tax & Compliance</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="Low">Low (General Inquiry)</option>
                    <option value="Medium">Medium (Normal Priority)</option>
                    <option value="High">High (Urgent Operational Issue)</option>
                    <option value="Urgent">Urgent (System Blocked / Financial Error)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order / Transaction ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-9912 or POS-2041"
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide full details of your issue, expected behavior, and steps to reproduce..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TICKET DETAILS & CONVERSATION MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {selectedTicket.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority} Priority
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Category: {selectedTicket.category}</p>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              {selectedTicket.replies.map((reply, idx) => {
                const isUser = reply.sender === 'User';
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-bold text-slate-700">{reply.name}</span>
                      <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      isUser 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                    }`}>
                      {reply.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Reply Box */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">Add Reply / Message</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a response to this ticket..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddReply}
                  disabled={!replyText.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
