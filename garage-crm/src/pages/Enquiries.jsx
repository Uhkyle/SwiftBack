import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Phone, 
  User, 
  Car,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Trash2,
  Eye,
  MoreVertical,
  MessageCircle,
  Briefcase,
  Calendar,
  Filter,
  Plus,
  X,
  Send,
  AlertCircle
} from 'lucide-react';

function Enquiries({ navigateTo }) {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleReg: '',
    vehicleMake: '',
    vehicleModel: '',
    message: '',
    source: 'manual',
  });

  const filteredEnquiries = state.enquiries
    .filter(enquiry => {
      const matchesSearch = 
        (enquiry.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (enquiry.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (enquiry.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (enquiry.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const stats = {
    total: state.enquiries.length,
    new: state.enquiries.filter(e => e.status === 'new').length,
    contacted: state.enquiries.filter(e => e.status === 'contacted').length,
    converted: state.enquiries.filter(e => e.status === 'converted').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-amber-100 text-amber-700';
      case 'converted': return 'bg-emerald-100 text-emerald-700';
      case 'closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return AlertCircle;
      case 'contacted': return MessageCircle;
      case 'converted': return CheckCircle;
      case 'closed': return XCircle;
      default: return Clock;
    }
  };

  const handleUpdateStatus = (id, status) => {
    dispatch({ type: 'UPDATE_ENQUIRY', payload: { id, status } });
    setShowMenu(null);
  };

  const handleConvertToJob = (id) => {
    dispatch({ type: 'CONVERT_ENQUIRY_TO_JOB', payload: id });
    setShowMenu(null);
    setSelectedEnquiry(null);
  };

  const handleDeleteEnquiry = (id) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      dispatch({ type: 'DELETE_ENQUIRY', payload: id });
      setShowMenu(null);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
    }
  };

  const handleAddEnquiry = () => {
    if (!newEnquiry.name || !newEnquiry.message) {
      alert('Please enter at least a name and message');
      return;
    }
    dispatch({ type: 'ADD_ENQUIRY', payload: newEnquiry });
    setNewEnquiry({
      name: '',
      email: '',
      phone: '',
      vehicleReg: '',
      vehicleMake: '',
      vehicleModel: '',
      message: '',
      source: 'manual',
    });
    setShowAddModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} min ago`;
      }
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const statusCards = [
    { status: 'all', label: 'All Enquiries', count: stats.total, color: 'slate', icon: MessageSquare },
    { status: 'new', label: 'New', count: stats.new, color: 'blue', icon: AlertCircle },
    { status: 'contacted', label: 'Contacted', count: stats.contacted, color: 'amber', icon: MessageCircle },
    { status: 'converted', label: 'Converted', count: stats.converted, color: 'emerald', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.status}
              onClick={() => setStatusFilter(card.status)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                statusFilter === card.status
                  ? `border-${card.color}-500 bg-${card.color}-50`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    statusFilter === card.status ? `text-${card.color}-600` : 'text-slate-500'
                  }`}>
                    {card.label}
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${
                    statusFilter === card.status ? `text-${card.color}-700` : 'text-slate-800'
                  }`}>
                    {card.count}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${
                  statusFilter === card.status ? `text-${card.color}-400` : 'text-slate-300'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" /> Add Enquiry
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredEnquiries.length === 0 ? (
            <div className="card text-center py-16">
              <MessageSquare className="w-20 h-20 mx-auto mb-4 text-slate-200" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No enquiries found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm ? 'Try adjusting your search' : 'Enquiries from your website will appear here'}
              </p>
              <button onClick={() => setShowAddModal(true)} className="btn-primary mx-auto">
                <Plus className="w-5 h-5" /> Add Manual Enquiry
              </button>
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => {
              const StatusIcon = getStatusIcon(enquiry.status);
              return (
                <div
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`card cursor-pointer transition-all hover:shadow-md ${
                    selectedEnquiry?.id === enquiry.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        enquiry.status === 'new' ? 'bg-blue-100' :
                        enquiry.status === 'contacted' ? 'bg-amber-100' :
                        enquiry.status === 'converted' ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        <StatusIcon className={`w-6 h-6 ${
                          enquiry.status === 'new' ? 'text-blue-600' :
                          enquiry.status === 'contacted' ? 'text-amber-600' :
                          enquiry.status === 'converted' ? 'text-emerald-600' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-800">{enquiry.name}</h4>
                          <span className={`status-badge ${getStatusColor(enquiry.status)}`}>
                            {enquiry.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">{enquiry.message}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {enquiry.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {enquiry.email}
                            </span>
                          )}
                          {enquiry.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {enquiry.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{formatDate(enquiry.createdAt)}</p>
                      <div className="relative mt-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === enquiry.id ? null : enquiry.id); }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                        {showMenu === enquiry.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                            {enquiry.status !== 'contacted' && enquiry.status !== 'converted' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(enquiry.id, 'contacted'); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                              >
                                <MessageCircle className="w-4 h-4" /> Mark Contacted
                              </button>
                            )}
                            {enquiry.status !== 'converted' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleConvertToJob(enquiry.id); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-emerald-600"
                              >
                                <Briefcase className="w-4 h-4" /> Convert to Job
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteEnquiry(enquiry.id); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Enquiry Detail Panel */}
        <div className="lg:col-span-1">
          {selectedEnquiry ? (
            <div className="card sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">Enquiry Details</h3>
                <button onClick={() => setSelectedEnquiry(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedEnquiry.name}</p>
                    <span className={`status-badge ${getStatusColor(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedEnquiry.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                  )}
                  {selectedEnquiry.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-600 hover:underline">
                        {selectedEnquiry.phone}
                      </a>
                    </div>
                  )}
                  {(selectedEnquiry.vehicleReg || selectedEnquiry.vehicleMake) && (
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-700">
                        {selectedEnquiry.vehicleReg && (
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded mr-2">
                            {selectedEnquiry.vehicleReg}
                          </span>
                        )}
                        {selectedEnquiry.vehicleMake} {selectedEnquiry.vehicleModel}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">
                      {new Date(selectedEnquiry.createdAt).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-500 mb-2">Message</p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">{selectedEnquiry.message}</p>
                </div>

                {selectedEnquiry.source && (
                  <div className="text-xs text-slate-400">
                    Source: {selectedEnquiry.source}
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  {selectedEnquiry.status !== 'converted' && (
                    <button 
                      onClick={() => handleConvertToJob(selectedEnquiry.id)}
                      className="btn-success w-full"
                    >
                      <Briefcase className="w-5 h-5" /> Convert to Job
                    </button>
                  )}
                  {selectedEnquiry.status === 'new' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'contacted')}
                      className="btn-secondary w-full"
                    >
                      <MessageCircle className="w-5 h-5" /> Mark as Contacted
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12 sticky top-6">
              <Eye className="w-12 h-12 mx-auto mb-3 text-slate-200" />
              <p className="text-slate-500">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Enquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Add Manual Enquiry</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  value={newEnquiry.name}
                  onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                  className="input-field"
                  placeholder="Customer name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={newEnquiry.email}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                    className="input-field"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    value={newEnquiry.phone}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    className="input-field"
                    placeholder="07123 456789"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Vehicle Reg</label>
                  <input
                    type="text"
                    value={newEnquiry.vehicleReg}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, vehicleReg: e.target.value.toUpperCase() })}
                    className="input-field font-mono"
                    placeholder="AB12 CDE"
                  />
                </div>
                <div>
                  <label className="label">Make</label>
                  <input
                    type="text"
                    value={newEnquiry.vehicleMake}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, vehicleMake: e.target.value })}
                    className="input-field"
                    placeholder="Ford"
                  />
                </div>
                <div>
                  <label className="label">Model</label>
                  <input
                    type="text"
                    value={newEnquiry.vehicleModel}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, vehicleModel: e.target.value })}
                    className="input-field"
                    placeholder="Focus"
                  />
                </div>
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea
                  value={newEnquiry.message}
                  onChange={(e) => setNewEnquiry({ ...newEnquiry, message: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="What does the customer need?"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddEnquiry} className="btn-primary">
                <Plus className="w-5 h-5" /> Add Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Info Card */}
      <div className="card bg-slate-50 border-2 border-dashed border-slate-300">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Send className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Receive Enquiries from Your Website</h3>
            <p className="text-sm text-slate-600 mb-3">
              Send enquiries from your front-end contact form to this CRM using the following format:
            </p>
            <div className="bg-slate-800 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`// Add to localStorage or send via API
const enquiry = {
  name: "Customer Name",
  email: "customer@email.com",
  phone: "07123 456789",
  vehicleReg: "AB12 CDE",
  vehicleMake: "Ford",
  vehicleModel: "Focus",
  message: "Need brake pads replaced",
  source: "website"
};

// Option 1: Direct localStorage (same domain)
const existing = JSON.parse(localStorage.getItem('garageCRM') || '{}');
existing.enquiries = existing.enquiries || [];
existing.enquiries.push({
  ...enquiry,
  id: Date.now().toString(36),
  createdAt: new Date().toISOString(),
  status: 'new'
});
localStorage.setItem('garageCRM', JSON.stringify(existing));`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enquiries;
