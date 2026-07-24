import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  X, 
  Printer, 
  User, 
  Phone, 
  Store, 
  Package, 
  Bike,
  MapPin,
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  RotateCcw,
  IndianRupee,
  Layers
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Order } from '../lib/store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Out for Delivery': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

type DateFilterType = 'ALL' | 'SPECIFIC_DATE' | 'DATE_RANGE' | 'MONTH_YEAR' | 'YEAR';

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const deliveryPartners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Date Filtering State
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('ALL');
  const [specificDate, setSpecificDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const now = new Date();
  const currentYearStr = String(now.getFullYear());
  const currentMonthStr = String(now.getMonth() + 1);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeDeliveryPartners = deliveryPartners.filter(p => p.status === 'Active');

  const updateOrderStatus = (id: string, newStatus: Order['status'], partnerId?: string) => {
    const list = marketplaceStore.getOrders();
    const updated = list.map(order => {
      if (order.id === id) {
        const item: Order = { ...order, status: newStatus };
        if (partnerId) {
          const partner = deliveryPartners.find(p => p.id === partnerId);
          if (partner) {
            item.deliveryPartnerId = partner.id;
            item.deliveryPartnerName = partner.name;
          }
        }
        return item;
      }
      return order;
    });
    marketplaceStore.saveOrders(updated);
    
    if (selectedOrder && selectedOrder.id === id) {
      const refreshed = updated.find(o => o.id === id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  // Helper to safely parse order date string
  const parseOrderDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const standard = new Date(dateStr);
    if (!isNaN(standard.getTime())) return standard;

    const cleaned = dateStr.replace(',', '');
    const standard2 = new Date(cleaned);
    if (!isNaN(standard2.getTime())) return standard2;

    const dmY = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dmY) {
      return new Date(parseInt(dmY[3]), parseInt(dmY[2]) - 1, parseInt(dmY[1]));
    }

    return null;
  };

  // Preset Handlers
  const handleApplyPreset = (preset: 'ALL' | 'TODAY' | 'YESTERDAY' | 'THIS_MONTH' | 'LAST_MONTH' | 'THIS_YEAR') => {
    const today = new Date();
    if (preset === 'ALL') {
      setDateFilterType('ALL');
      setSpecificDate('');
      setStartDate('');
      setEndDate('');
    } else if (preset === 'TODAY') {
      setDateFilterType('SPECIFIC_DATE');
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setSpecificDate(`${yyyy}-${mm}-${dd}`);
    } else if (preset === 'YESTERDAY') {
      setDateFilterType('SPECIFIC_DATE');
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yyyy = yesterday.getFullYear();
      const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
      const dd = String(yesterday.getDate()).padStart(2, '0');
      setSpecificDate(`${yyyy}-${mm}-${dd}`);
    } else if (preset === 'THIS_MONTH') {
      setDateFilterType('MONTH_YEAR');
      setSelectedMonth(String(today.getMonth() + 1));
      setSelectedYear(String(today.getFullYear()));
    } else if (preset === 'LAST_MONTH') {
      setDateFilterType('MONTH_YEAR');
      const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      setSelectedMonth(String(lastMonthDate.getMonth() + 1));
      setSelectedYear(String(lastMonthDate.getFullYear()));
    } else if (preset === 'THIS_YEAR') {
      setDateFilterType('YEAR');
      setSelectedYear(String(today.getFullYear()));
    }
  };

  const handleResetFilters = () => {
    setDateFilterType('ALL');
    setSpecificDate('');
    setStartDate('');
    setEndDate('');
    setSelectedMonth(currentMonthStr);
    setSelectedYear(currentYearStr);
    setSearchQuery('');
    setActiveTab('All');
  };

  // Primary Filtering Logic
  const filteredOrders = orders.filter(o => {
    // 1. Search Query
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.phone && o.phone.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Status Tab
    const matchesStatus = activeTab === 'All' || o.status === activeTab;
    if (!matchesStatus) return false;

    // 3. Date Filter
    if (dateFilterType === 'ALL') return true;

    const oDate = parseOrderDate(o.date);
    if (!oDate) return true; // If date cannot be parsed, include it

    const oYear = oDate.getFullYear();
    const oMonth = oDate.getMonth() + 1; // 1-12
    const oDay = oDate.getDate();

    if (dateFilterType === 'SPECIFIC_DATE') {
      if (!specificDate) return true;
      const [sY, sM, sD] = specificDate.split('-').map(Number);
      return oYear === sY && oMonth === sM && oDay === sD;
    }

    if (dateFilterType === 'DATE_RANGE') {
      if (!startDate && !endDate) return true;
      const start = startDate ? new Date(startDate) : new Date(0);
      start.setHours(0, 0, 0, 0);

      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      end.setHours(23, 59, 59, 999);

      return oDate >= start && oDate <= end;
    }

    if (dateFilterType === 'MONTH_YEAR') {
      const matchM = selectedMonth ? oMonth === Number(selectedMonth) : true;
      const matchY = selectedYear ? oYear === Number(selectedYear) : true;
      return matchM && matchY;
    }

    if (dateFilterType === 'YEAR') {
      return selectedYear ? oYear === Number(selectedYear) : true;
    }

    return true;
  });

  // Calculate Summary Numbers for Filtered Dataset
  const totalFilteredRevenue = filteredOrders.reduce((sum, o) => {
    const val = parseFloat(o.amount.replace(/[^0-9.]/g, '')) || 0;
    return sum + val;
  }, 0);

  const avgOrderValue = filteredOrders.length > 0 
    ? totalFilteredRevenue / filteredOrders.length 
    : 0;

  // Formatting filter label for exports & headers
  const getFilterLabel = () => {
    if (dateFilterType === 'ALL') return 'All Time';
    if (dateFilterType === 'SPECIFIC_DATE') return specificDate ? `Date: ${specificDate}` : 'Specific Date';
    if (dateFilterType === 'DATE_RANGE') return `Range: ${startDate || 'Start'} to ${endDate || 'End'}`;
    if (dateFilterType === 'MONTH_YEAR') {
      const monthName = new Date(2026, Number(selectedMonth) - 1, 1).toLocaleString('en-US', { month: 'long' });
      return `${monthName} ${selectedYear}`;
    }
    if (dateFilterType === 'YEAR') return `Year ${selectedYear}`;
    return 'Custom Filter';
  };

  // CSV Export Logic
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No order data available to export for the current filters.');
      return;
    }

    const headers = [
      'Order ID',
      'Date & Time',
      'Customer Name',
      'Customer Phone',
      'Store Name',
      'Total Amount (₹)',
      'Status',
      'Assigned Courier',
      'Delivery Address',
      'Items Count'
    ];

    const rows = filteredOrders.map(o => {
      const itemsCount = Array.isArray(o.items) ? o.items.length : 1;
      const numAmount = o.amount.replace(/[^0-9.]/g, '');
      return [
        `"${o.id}"`,
        `"${o.date}"`,
        `"${o.customer.replace(/"/g, '""')}"`,
        `"${o.phone || 'N/A'}"`,
        `"${o.store.replace(/"/g, '""')}"`,
        `"${numAmount}"`,
        `"${o.status}"`,
        `"${(o.deliveryPartnerName || 'Unassigned').replace(/"/g, '""')}"`,
        `"${(o.address || 'N/A').replace(/"/g, '""')}"`,
        `"${itemsCount}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timeStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `wikcart_orders_${timeStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredOrders.length} orders to CSV file!`);
  };

  // PDF Export Logic using jsPDF & AutoTable
  const handleExportPDF = () => {
    if (filteredOrders.length === 0) {
      alert('No order data available to export for the current filters.');
      return;
    }

    const doc = new jsPDF('landscape', 'pt', 'a4');
    
    // Title Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 842, 60, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('WIKCART HYPERLOCAL MARKETPLACE', 40, 35);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ORDERS & DISPATCH REPORT', 40, 50);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 650, 35);
    doc.text(`Filter Mode: ${getFilterLabel()}`, 650, 48);

    // Summary Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(40, 75, 762, 45, 6, 6, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);

    doc.text(`Total Filtered Orders: `, 55, 102);
    doc.setFont('helvetica', 'normal');
    doc.text(`${filteredOrders.length}`, 160, 102);

    doc.setFont('helvetica', 'bold');
    doc.text(`Total Filtered Revenue: `, 240, 102);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs. ${totalFilteredRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 360, 102);

    doc.setFont('helvetica', 'bold');
    doc.text(`Status Filter: `, 520, 102);
    doc.setFont('helvetica', 'normal');
    doc.text(`${activeTab}`, 600, 102);

    // Table Columns & Rows
    const tableHeaders = [
      ['#', 'Order ID', 'Date & Time', 'Customer', 'Store', 'Items', 'Amount (Rs)', 'Status', 'Courier']
    ];

    const tableData = filteredOrders.map((o, index) => {
      const itemsCount = Array.isArray(o.items) ? o.items.length : 1;
      const numAmount = o.amount.replace(/[^0-9.]/g, '');
      return [
        index + 1,
        o.id,
        o.date,
        o.customer,
        o.store,
        `${itemsCount} item(s)`,
        numAmount,
        o.status,
        o.deliveryPartnerName || 'Unassigned'
      ];
    });

    autoTable(doc, {
      startY: 135,
      head: tableHeaders,
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [37, 99, 235], // blue-600
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 70, fontStyle: 'bold' },
        2: { cellWidth: 100 },
        3: { cellWidth: 110 },
        4: { cellWidth: 110 },
        5: { cellWidth: 60 },
        6: { cellWidth: 75, fontStyle: 'bold' },
        7: { cellWidth: 80, fontStyle: 'bold' },
        8: { cellWidth: 100 }
      },
      margin: { left: 40, right: 40 }
    });

    // Page Numbers Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${pageCount} - Wikcart Confidential Internal Report`, 40, 575);
    }

    const timeStamp = new Date().toISOString().slice(0, 10);
    doc.save(`wikcart_orders_report_${timeStamp}.pdf`);

    showToast(`Exported ${filteredOrders.length} orders to PDF document!`);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header with Export Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-slate-500 text-sm mt-1">View, filter, track, and export customer orders across all stores.</p>
        </div>

        {/* Action Controls: Search & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 lg:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search order ID, phone, store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full lg:w-60 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none shadow-2xs"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Download Filtered Orders as CSV"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            title="Download Filtered Orders as Printable PDF"
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Date Filtering Control Panel */}
      <Card className="border border-slate-200 bg-white shadow-2xs">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Date & Period Filter</span>
            </div>

            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Presets:</span>
              <button
                onClick={() => handleApplyPreset('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  dateFilterType === 'ALL' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => handleApplyPreset('TODAY')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  dateFilterType === 'SPECIFIC_DATE' && specificDate === new Date().toISOString().slice(0, 10)
                    ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => handleApplyPreset('YESTERDAY')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Yesterday
              </button>
              <button
                onClick={() => handleApplyPreset('THIS_MONTH')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  dateFilterType === 'MONTH_YEAR' && selectedMonth === currentMonthStr && selectedYear === currentYearStr
                    ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => handleApplyPreset('LAST_MONTH')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Last Month
              </button>
              <button
                onClick={() => handleApplyPreset('THIS_YEAR')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  dateFilterType === 'YEAR' && selectedYear === currentYearStr
                    ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                This Year
              </button>
            </div>
          </div>

          {/* Interactive Date Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
            
            {/* Filter Mode Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Filter Mode</label>
              <select
                value={dateFilterType}
                onChange={(e) => setDateFilterType(e.target.value as DateFilterType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="ALL">All Dates (No Filter)</option>
                <option value="SPECIFIC_DATE">Specific Date</option>
                <option value="DATE_RANGE">Date Range (Start - End)</option>
                <option value="MONTH_YEAR">Month & Year</option>
                <option value="YEAR">Specific Year</option>
              </select>
            </div>

            {/* Dynamic Controls based on Filter Mode */}
            {dateFilterType === 'SPECIFIC_DATE' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Date</label>
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            )}

            {dateFilterType === 'DATE_RANGE' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </>
            )}

            {dateFilterType === 'MONTH_YEAR' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Select Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {[
                      { val: '1', name: 'January' },
                      { val: '2', name: 'February' },
                      { val: '3', name: 'March' },
                      { val: '4', name: 'April' },
                      { val: '5', name: 'May' },
                      { val: '6', name: 'June' },
                      { val: '7', name: 'July' },
                      { val: '8', name: 'August' },
                      { val: '9', name: 'September' },
                      { val: '10', name: 'October' },
                      { val: '11', name: 'November' },
                      { val: '12', name: 'December' }
                    ].map(m => (
                      <option key={m.val} value={m.val}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Select Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {['2024', '2025', '2026', '2027', '2028', '2029', '2030'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {dateFilterType === 'YEAR' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {['2024', '2025', '2026', '2027', '2028', '2029', '2030'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Filters Button */}
            <div>
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filter Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Active Period:</span>
              <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                {getFilterLabel()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <span>Orders: <strong className="text-slate-900 font-extrabold">{filteredOrders.length}</strong></span>
              <span>Total Revenue: <strong className="text-emerald-700 font-extrabold">₹{totalFilteredRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
              <span>Avg Order: <strong className="text-purple-700 font-extrabold">₹{avgOrderValue.toFixed(2)}</strong></span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Orders Table Container */}
      <Card className="border border-slate-200">
        <CardHeader className="border-b border-slate-100 p-0 bg-slate-50/50">
          <div className="flex items-center justify-between px-6 py-3 overflow-x-auto">
            <div className="flex gap-2">
              {['All', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(tab => {
                const count = tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white shadow-2xs' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Customer / Store</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                      <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No orders found matching the selected filter criteria.
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td 
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-4 font-bold text-blue-600 cursor-pointer hover:underline"
                    >
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.customer}</div>
                      <div className="text-xs text-slate-500 font-medium">{order.store}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200" 
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Confirmed')} 
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
                              title="Approve/Accept Order"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Cancelled')} 
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                              title="Cancel Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {order.status === 'Confirmed' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Out for Delivery')} 
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
                            title="Dispatch Order"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'Out for Delivery' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Delivered')} 
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
                            title="Mark Delivered"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FULL-FEATURED INTERACTIVE ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl border border-slate-200 shadow-2xl bg-white max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-extrabold text-slate-900">{selectedOrder.id}</CardTitle>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Placed on {selectedOrder.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition cursor-pointer"
                  title="Print Invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            {/* Modal Body */}
            <CardContent className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Customer & Store Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Customer Information
                  </h4>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.customer}</p>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${selectedOrder.phone || '9821054321'}`} className="text-blue-600 hover:underline">
                      {selectedOrder.phone || '+91 98210 54321'}
                    </a>
                  </div>
                  <div className="text-xs text-slate-600 flex items-start gap-1.5 font-medium pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.address || 'Civil Lines, Sultanpur, Uttar Pradesh - 228001'}</span>
                  </div>
                </div>

                {/* Merchant & Delivery Details */}
                <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-600" /> Store & Courier Info
                  </h4>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.store}</p>
                  
                  {/* Assigned Courier */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Bike className="w-3 h-3 text-indigo-600" /> Assigned Courier
                    </p>
                    <select
                      value={selectedOrder.deliveryPartnerId || ''}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.status, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">-- No Courier Assigned --</option>
                      {activeDeliveryPartners.map(dp => (
                        <option key={dp.id} value={dp.id}>{dp.name} ({dp.type})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-500" /> Order Items & Pricing
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Item Name</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                            <td className="px-4 py-3 text-center text-slate-600 font-bold">x{item.qty}</td>
                            <td className="px-4 py-3 text-right font-extrabold text-slate-900">{item.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-3 font-bold text-slate-800">Hyperlocal Marketplace Item</td>
                          <td className="px-4 py-3 text-center text-slate-600 font-bold">x1</td>
                          <td className="px-4 py-3 text-right font-extrabold text-slate-900">{selectedOrder.amount}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Financial Total Summary */}
                  <div className="p-4 bg-slate-50/90 border-t border-slate-200 space-y-1.5 text-xs font-medium">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800">{selectedOrder.amount}</span>
                    </div>
                    {selectedOrder.discountAmount && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount ({selectedOrder.discountReason || 'Coupon'})</span>
                        <span>-{selectedOrder.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery & Handling Fee</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                      <span>Total Amount Payable</span>
                      <span className="text-blue-600 text-base">{selectedOrder.amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Order Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedOrder.status === st 
                          ? 'bg-blue-600 text-white shadow-2xs' 
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Store ID: <strong className="text-slate-800">{selectedOrder.store}</strong>
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
