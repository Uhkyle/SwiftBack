import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Search, 
  Receipt,
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
  MoreVertical,
  AlertCircle,
  Download
} from 'lucide-react';

function Invoices({ navigateTo, viewingInvoice, setViewingInvoice }) {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);

  const filteredInvoices = state.invoices
    .filter(invoice => {
      const matchesSearch = 
        (invoice.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (invoice.vehicleReg?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (invoice.invoiceNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusColor = (status) => {
    switch (status) {
      case 'unpaid': return 'bg-amber-100 text-amber-700';
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'partial': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleUpdateStatus = (invoiceId, status) => {
    dispatch({ type: 'UPDATE_INVOICE', payload: { id: invoiceId, status } });
    setShowMenu(null);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      dispatch({ type: 'DELETE_INVOICE', payload: invoiceId });
    }
    setShowMenu(null);
  };

  const invoiceStats = {
    total: state.invoices.length,
    unpaid: state.invoices.filter(i => i.status === 'unpaid').length,
    paid: state.invoices.filter(i => i.status === 'paid').length,
    overdue: state.invoices.filter(i => i.status === 'overdue').length,
  };

  const totalUnpaid = state.invoices
    .filter(i => i.status === 'unpaid' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const totalPaid = state.invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const isOverdue = (invoice) => {
    if (invoice.status === 'paid') return false;
    return new Date(invoice.dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card py-4">
          <p className="text-sm text-slate-500">Total Invoices</p>
          <p className="text-2xl font-bold text-slate-800">{invoiceStats.total}</p>
        </div>
        <div className="card py-4">
          <p className="text-sm text-slate-500">Unpaid</p>
          <p className="text-2xl font-bold text-amber-600">{invoiceStats.unpaid}</p>
          <p className="text-sm text-slate-500 mt-1">£{totalUnpaid.toFixed(2)}</p>
        </div>
        <div className="card py-4">
          <p className="text-sm text-slate-500">Paid</p>
          <p className="text-2xl font-bold text-emerald-600">{invoiceStats.paid}</p>
          <p className="text-sm text-slate-500 mt-1">£{totalPaid.toFixed(2)}</p>
        </div>
        <div className="card py-4">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{invoiceStats.overdue}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 mb-4">No invoices found</p>
            <p className="text-sm text-slate-400">Convert quotes to invoices to see them here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">Invoice #</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Vehicle</th>
                  <th className="table-header">Created</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className={`hover:bg-slate-50 ${isOverdue(invoice) ? 'bg-red-50' : ''}`}>
                    <td className="table-cell">
                      <span className="font-mono text-sm font-medium text-primary-600">
                        {invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{invoice.customerName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-400" />
                        <span>{invoice.vehicleReg || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {new Date(invoice.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        {isOverdue(invoice) && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm ${isOverdue(invoice) ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                          {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-GB') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="font-semibold text-slate-800">
                        £{(invoice.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="relative">
                        <button 
                          onClick={() => setShowMenu(showMenu === invoice.id ? null : invoice.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-500" />
                        </button>
                        {showMenu === invoice.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[180px]">
                            <button 
                              onClick={() => { setViewingInvoice(invoice); setShowMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                            {invoice.status !== 'paid' && (
                              <button 
                                onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-emerald-600"
                              >
                                <CheckCircle className="w-4 h-4" /> Mark as Paid
                              </button>
                            )}
                            {invoice.status === 'unpaid' && (
                              <button 
                                onClick={() => handleUpdateStatus(invoice.id, 'partial')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-blue-600"
                              >
                                <Clock className="w-4 h-4" /> Mark Partial Payment
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteInvoice(invoice.id)}
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

      {viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{viewingInvoice.invoiceNumber}</h3>
                <span className={`status-badge ${getStatusColor(viewingInvoice.status)}`}>
                  {viewingInvoice.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-sm">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button className="btn-secondary text-sm">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button className="btn-secondary text-sm">
                  <Send className="w-4 h-4" /> Email
                </button>
                <button onClick={() => setViewingInvoice(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">INVOICE</h2>
                  <p className="text-slate-500">{viewingInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Issue Date</p>
                  <p className="font-medium">{new Date(viewingInvoice.createdAt).toLocaleDateString('en-GB')}</p>
                  <p className="text-sm text-slate-500 mt-2">Due Date</p>
                  <p className={`font-medium ${isOverdue(viewingInvoice) ? 'text-red-600' : ''}`}>
                    {viewingInvoice.dueDate ? new Date(viewingInvoice.dueDate).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Bill To</h4>
                  <p className="font-medium text-slate-800">{viewingInvoice.customerName}</p>
                  <p className="text-sm text-slate-500">{viewingInvoice.customerPhone}</p>
                  <p className="text-sm text-slate-500">{viewingInvoice.customerEmail}</p>
                  <p className="text-sm text-slate-500">{viewingInvoice.customerAddress}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Vehicle</h4>
                  <p className="font-medium text-slate-800">{viewingInvoice.vehicleReg}</p>
                  <p className="text-sm text-slate-500">{viewingInvoice.vehicleMake} {viewingInvoice.vehicleModel}</p>
                  <p className="text-sm text-slate-500">Year: {viewingInvoice.vehicleYear}</p>
                  <p className="text-sm text-slate-500">Mileage: {viewingInvoice.vehicleMileage}</p>
                </div>
              </div>

              {viewingInvoice.workRequired && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Work Completed</h4>
                  <p className="text-slate-700">{viewingInvoice.workRequired}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Invoice Details</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {viewingInvoice.labourItems?.length > 0 && (
                    <div className="border-b border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 uppercase">
                        Labour
                      </div>
                      {viewingInvoice.labourItems.map((item, index) => (
                        <div key={index} className="px-4 py-3 flex justify-between">
                          <span className="text-slate-700">{item.description} ({item.hours}h × £{item.rate}/hr)</span>
                          <span className="font-medium">£{(item.hours * item.rate).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {viewingInvoice.partsItems?.length > 0 && (
                    <div className="border-b border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 uppercase">
                        Parts
                      </div>
                      {viewingInvoice.partsItems.map((item, index) => (
                        <div key={index} className="px-4 py-3 flex justify-between">
                          <div>
                            <span className="text-slate-700">{item.name}</span>
                            {item.partNumber && (
                              <span className="text-xs text-slate-400 ml-2">({item.partNumber})</span>
                            )}
                            <span className="text-slate-500 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-medium">£{(item.quantity * item.unitPrice).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bg-slate-50 px-4 py-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span>£{(viewingInvoice.subtotal || 0).toFixed(2)}</span>
                    </div>
                    {viewingInvoice.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Discount</span>
                        <span className="text-emerald-600">-£{viewingInvoice.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">VAT ({viewingInvoice.vatRate || 20}%)</span>
                      <span>£{(viewingInvoice.vat || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-3 border-t border-slate-200">
                      <span>Total Due</span>
                      <span className="text-primary-600">£{(viewingInvoice.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {viewingInvoice.status !== 'paid' && (
                  <button 
                    onClick={() => { handleUpdateStatus(viewingInvoice.id, 'paid'); setViewingInvoice(null); }}
                    className="btn-success flex-1"
                  >
                    <CheckCircle className="w-5 h-5" /> Mark as Paid
                  </button>
                )}
                <button onClick={() => setViewingInvoice(null)} className="btn-secondary flex-1">
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

export default Invoices;
