import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Search, 
  FileText,
  ArrowRight,
  Trash2,
  Eye,
  X,
  User,
  Car,
  Calendar,
  Printer,
  Send,
  CheckCircle,
  Clock,
  MoreVertical
} from 'lucide-react';

function Quotes({ navigateTo, viewingQuote, setViewingQuote }) {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);

  const filteredQuotes = state.quotes
    .filter(quote => {
      const matchesSearch = 
        (quote.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (quote.vehicleReg?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (quote.quoteNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'accepted': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'expired': return 'bg-slate-100 text-slate-700';
      case 'converted': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleConvertToInvoice = (quoteId) => {
    dispatch({ type: 'CONVERT_QUOTE_TO_INVOICE', payload: quoteId });
    setViewingQuote(null);
    setShowMenu(null);
    navigateTo('invoices');
  };

  const handleDeleteQuote = (quoteId) => {
    if (confirm('Are you sure you want to delete this quote?')) {
      dispatch({ type: 'DELETE_QUOTE', payload: quoteId });
    }
    setShowMenu(null);
  };

  const handleUpdateStatus = (quoteId, status) => {
    dispatch({ type: 'UPDATE_QUOTE', payload: { id: quoteId, status } });
    setShowMenu(null);
  };

  const quoteStats = {
    total: state.quotes.length,
    pending: state.quotes.filter(q => q.status === 'pending').length,
    accepted: state.quotes.filter(q => q.status === 'accepted').length,
    converted: state.quotes.filter(q => q.status === 'converted').length,
  };

  const totalQuoteValue = state.quotes
    .filter(q => q.status === 'pending' || q.status === 'accepted')
    .reduce((sum, q) => sum + (q.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card py-4">
          <p className="text-sm text-slate-500">Total Quotes</p>
          <p className="text-2xl font-bold text-slate-800">{quoteStats.total}</p>
        </div>
        <div className="card py-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{quoteStats.pending}</p>
        </div>
        <div className="card py-4">
          <p className="text-sm text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-emerald-600">{quoteStats.accepted}</p>
        </div>
        <div className="card py-4">
          <p className="text-sm text-slate-500">Quote Value</p>
          <p className="text-2xl font-bold text-primary-600">£{totalQuoteValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="converted">Converted</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 mb-4">No quotes found</p>
            <button onClick={() => navigateTo('create-job')} className="btn-primary">
              Create a Job to Generate Quotes
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">Quote #</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Vehicle</th>
                  <th className="table-header">Created</th>
                  <th className="table-header">Valid Until</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="table-cell">
                      <span className="font-mono text-sm font-medium text-primary-600">
                        {quote.quoteNumber}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{quote.customerName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-400" />
                        <span>{quote.vehicleReg || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {new Date(quote.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="font-semibold text-slate-800">
                        £{(quote.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="relative">
                        <button 
                          onClick={() => setShowMenu(showMenu === quote.id ? null : quote.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-500" />
                        </button>
                        {showMenu === quote.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
                            <button 
                              onClick={() => { setViewingQuote(quote); setShowMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                            {quote.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(quote.id, 'accepted')}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-emerald-600"
                                >
                                  <CheckCircle className="w-4 h-4" /> Mark Accepted
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(quote.id, 'rejected')}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600"
                                >
                                  <X className="w-4 h-4" /> Mark Rejected
                                </button>
                              </>
                            )}
                            {(quote.status === 'pending' || quote.status === 'accepted') && (
                              <button 
                                onClick={() => handleConvertToInvoice(quote.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-primary-600"
                              >
                                <ArrowRight className="w-4 h-4" /> Convert to Invoice
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteQuote(quote.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{viewingQuote.quoteNumber}</h3>
                <span className={`status-badge ${getStatusColor(viewingQuote.status)}`}>
                  {viewingQuote.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-sm">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button className="btn-secondary text-sm">
                  <Send className="w-4 h-4" /> Send
                </button>
                <button onClick={() => setViewingQuote(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Customer</h4>
                  <p className="font-medium text-slate-800">{viewingQuote.customerName}</p>
                  <p className="text-sm text-slate-500">{viewingQuote.customerPhone}</p>
                  <p className="text-sm text-slate-500">{viewingQuote.customerEmail}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Vehicle</h4>
                  <p className="font-medium text-slate-800">{viewingQuote.vehicleReg}</p>
                  <p className="text-sm text-slate-500">{viewingQuote.vehicleMake} {viewingQuote.vehicleModel}</p>
                  <p className="text-sm text-slate-500">{viewingQuote.vehicleYear}</p>
                </div>
              </div>

              {viewingQuote.workRequired && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Work Required</h4>
                  <p className="text-slate-700">{viewingQuote.workRequired}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Price Breakdown</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {viewingQuote.labourItems?.length > 0 && (
                    <div className="border-b border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 uppercase">
                        Labour
                      </div>
                      {viewingQuote.labourItems.map((item, index) => (
                        <div key={index} className="px-4 py-3 flex justify-between">
                          <span className="text-slate-700">{item.description} ({item.hours}h × £{item.rate})</span>
                          <span className="font-medium">£{(item.hours * item.rate).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {viewingQuote.partsItems?.length > 0 && (
                    <div className="border-b border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 uppercase">
                        Parts
                      </div>
                      {viewingQuote.partsItems.map((item, index) => (
                        <div key={index} className="px-4 py-3 flex justify-between">
                          <span className="text-slate-700">{item.name} ({item.quantity} × £{item.unitPrice})</span>
                          <span className="font-medium">£{(item.quantity * item.unitPrice).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bg-slate-50 px-4 py-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span>£{(viewingQuote.subtotal || 0).toFixed(2)}</span>
                    </div>
                    {viewingQuote.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Discount</span>
                        <span>-£{viewingQuote.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">VAT ({viewingQuote.vatRate || 20}%)</span>
                      <span>£{(viewingQuote.vat || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-primary-600">£{(viewingQuote.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {(viewingQuote.status === 'pending' || viewingQuote.status === 'accepted') && (
                  <button 
                    onClick={() => handleConvertToInvoice(viewingQuote.id)}
                    className="btn-success flex-1"
                  >
                    <ArrowRight className="w-5 h-5" /> Convert to Invoice
                  </button>
                )}
                <button onClick={() => setViewingQuote(null)} className="btn-secondary flex-1">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quotes;
