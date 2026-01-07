import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Car,
  User,
  Calendar,
  LayoutGrid,
  List,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  PoundSterling,
  Wrench,
  Phone
} from 'lucide-react';

function Jobs({ navigateTo }) {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showMenu, setShowMenu] = useState(null);
  const [viewMode, setViewMode] = useState('cards');

  const filteredJobs = state.jobs
    .filter(job => {
      const matchesSearch = 
        (job.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.vehicleReg?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (job.vehicleMake?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'customer') return (a.customerName || '').localeCompare(b.customerName || '');
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'quoted': return 'bg-purple-100 text-purple-700';
      case 'invoiced': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleDeleteJob = (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      dispatch({ type: 'DELETE_JOB', payload: jobId });
    }
    setShowMenu(null);
  };

  const jobStats = {
    total: state.jobs.length,
    pending: state.jobs.filter(j => j.status === 'pending').length,
    inProgress: state.jobs.filter(j => j.status === 'in-progress').length,
    completed: state.jobs.filter(j => j.status === 'completed').length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in-progress': return Wrench;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const statusCards = [
    { status: 'all', label: 'All Jobs', count: jobStats.total, color: 'slate' },
    { status: 'pending', label: 'Pending', count: jobStats.pending, color: 'amber' },
    { status: 'in-progress', label: 'In Progress', count: jobStats.inProgress, color: 'blue' },
    { status: 'completed', label: 'Completed', count: jobStats.completed, color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((card) => (
          <button
            key={card.status}
            onClick={() => setStatusFilter(card.status)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              statusFilter === card.status
                ? `border-${card.color}-500 bg-${card.color}-50`
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
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
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, reg, or make..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="customer">By Customer</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                }`}
              >
                <LayoutGrid className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                }`}
              >
                <List className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <button onClick={() => navigateTo('create-job')} className="btn-primary">
              <Plus className="w-5 h-5" /> New Job
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Display */}
      {filteredJobs.length === 0 ? (
        <div className="card text-center py-16">
          <Car className="w-20 h-20 mx-auto mb-4 text-slate-200" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first job to get started'}
          </p>
          <button onClick={() => navigateTo('create-job')} className="btn-primary mx-auto">
            <Plus className="w-5 h-5" /> Create New Job
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status);
            return (
              <div
                key={job.id}
                onClick={() => navigateTo('create-job', job)}
                className="card hover:shadow-lg transition-all cursor-pointer group border-l-4"
                style={{
                  borderLeftColor: job.status === 'pending' ? '#f59e0b' :
                    job.status === 'in-progress' ? '#3b82f6' :
                    job.status === 'completed' ? '#10b981' :
                    job.status === 'cancelled' ? '#ef4444' : '#94a3b8'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{job.customerName || 'No Customer'}</p>
                      <p className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded inline-block">
                        {job.vehicleReg || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(job.status)}`}>
                    {job.status || 'pending'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span>{job.vehicleMake} {job.vehicleModel} {job.vehicleYear && `(${job.vehicleYear})`}</span>
                  </div>
                  {job.scheduledDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{new Date(job.scheduledDate + 'T00:00:00').toLocaleDateString('en-GB', { 
                        weekday: 'short', day: 'numeric', month: 'short' 
                      })}</span>
                      {job.scheduledTime && <span className="text-slate-400">at {job.scheduledTime}</span>}
                    </div>
                  )}
                  {job.customerPhone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{job.customerPhone}</span>
                    </div>
                  )}
                </div>

                {job.workRequired && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 border-l-2 border-slate-200 pl-3">
                    {job.workRequired}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500">
                    <PoundSterling className="w-4 h-4" />
                    <span className="text-lg font-bold text-slate-800">
                      {(job.total || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">View details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Vehicle</th>
                  <th className="table-header">Scheduled</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigateTo('create-job', job)}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{job.customerName || 'No Customer'}</p>
                          <p className="text-sm text-slate-500">{job.customerPhone || 'No Phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded inline-block">{job.vehicleReg || 'N/A'}</p>
                        <p className="text-sm text-slate-500 mt-1">{job.vehicleMake} {job.vehicleModel}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {job.scheduledDate ? new Date(job.scheduledDate + 'T00:00:00').toLocaleDateString('en-GB') : 'Not scheduled'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status || 'pending'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="font-bold text-slate-800">
                        £{(job.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setShowMenu(showMenu === job.id ? null : job.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-500" />
                        </button>
                        {showMenu === job.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[150px]">
                            <button 
                              onClick={() => { navigateTo('create-job', job); setShowMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View/Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job.id)}
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
        </div>
      )}

      {/* Results count */}
      {filteredJobs.length > 0 && (
        <p className="text-sm text-slate-500 text-center">
          Showing {filteredJobs.length} of {state.jobs.length} jobs
        </p>
      )}
    </div>
  );
}

export default Jobs;
