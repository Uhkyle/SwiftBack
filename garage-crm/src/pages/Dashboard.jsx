import React from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Receipt, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  Calendar,
  Car,
  PoundSterling,
  Wrench,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';

function Dashboard({ navigateTo }) {
  const { state } = useCRM();
  const today = new Date().toISOString().split('T')[0];

  const stats = [
    {
      label: 'Active Jobs',
      value: state.jobs.filter(j => j.status === 'in-progress').length,
      total: state.jobs.length,
      icon: Briefcase,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      trend: '+2 this week',
      onClick: () => navigateTo('jobs'),
    },
    {
      label: 'Customers',
      value: state.customers.length,
      icon: Users,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      trend: 'Total registered',
      onClick: () => navigateTo('customers'),
    },
    {
      label: 'Pending Quotes',
      value: state.quotes.filter(q => q.status === 'pending').length,
      total: state.quotes.length,
      icon: FileText,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      trend: 'Awaiting response',
      onClick: () => navigateTo('quotes'),
    },
    {
      label: 'Unpaid Invoices',
      value: state.invoices.filter(i => i.status === 'unpaid').length,
      total: state.invoices.length,
      icon: Receipt,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      trend: 'Needs attention',
      onClick: () => navigateTo('invoices'),
    },
  ];

  const totalRevenue = state.invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const unpaidTotal = state.invoices
    .filter(i => i.status === 'unpaid' || i.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const pendingQuotesValue = state.quotes
    .filter(q => q.status === 'pending')
    .reduce((sum, q) => sum + (q.total || 0), 0);

  const recentJobs = state.jobs.slice(-5).reverse();
  const pendingQuotes = state.quotes.filter(q => q.status === 'pending').slice(-5).reverse();

  const todaysJobs = state.jobs.filter(j => j.scheduledDate === today);
  const todaysEvents = state.calendarEvents.filter(e => e.date === today);

  const overdueInvoices = state.invoices.filter(i => {
    if (i.status === 'paid') return false;
    return new Date(i.dueDate) < new Date();
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const quickActions = [
    { label: 'New Job', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700', action: () => navigateTo('create-job') },
    { label: 'Add Customer', icon: Users, color: 'bg-emerald-600 hover:bg-emerald-700', action: () => navigateTo('customers') },
    { label: 'View Calendar', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700', action: () => navigateTo('calendar') },
    { label: 'All Invoices', icon: Receipt, color: 'bg-amber-600 hover:bg-amber-700', action: () => navigateTo('invoices') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back! 👋</h1>
            <p className="text-blue-100">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-200" />
                <span>{todaysJobs.length} jobs today</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-200" />
                <span>{todaysEvents.length} events</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.action}
                  className={`${action.color} text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              onClick={stat.onClick}
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {stat.value}
                    {stat.total !== undefined && (
                      <span className="text-lg text-slate-400 font-normal">/{stat.total}</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
                </div>
                <div className={`${stat.lightColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">£{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-amber-100 text-sm">Awaiting Payment</p>
              <p className="text-3xl font-bold">£{unpaidTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100 text-sm">Pending Quotes Value</p>
              <p className="text-3xl font-bold">£{pendingQuotesValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(overdueInvoices.length > 0 || todaysJobs.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overdueInvoices.length > 0 && (
            <div className="card border-l-4 border-l-red-500 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Overdue Invoices</h3>
                  <p className="text-sm text-red-600 mt-1">
                    {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''} past due date
                  </p>
                  <button 
                    onClick={() => navigateTo('invoices')}
                    className="text-sm text-red-700 font-medium mt-2 hover:underline"
                  >
                    View overdue invoices →
                  </button>
                </div>
              </div>
            </div>
          )}
          {todaysJobs.length > 0 && (
            <div className="card border-l-4 border-l-blue-500 bg-blue-50">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800">Today's Schedule</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    {todaysJobs.length} job{todaysJobs.length !== 1 ? 's' : ''} scheduled for today
                  </p>
                  <button 
                    onClick={() => navigateTo('calendar')}
                    className="text-sm text-blue-700 font-medium mt-2 hover:underline"
                  >
                    View calendar →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-800">Recent Jobs</h3>
            <button 
              onClick={() => navigateTo('jobs')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p className="font-medium text-slate-600">No jobs yet</p>
              <p className="text-sm mt-1">Create your first job to get started</p>
              <button 
                onClick={() => navigateTo('create-job')}
                className="btn-primary mt-4"
              >
                <Plus className="w-4 h-4" /> Create First Job
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => navigateTo('create-job', job)}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-all hover:shadow-sm group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{job.customerName || 'No Customer'}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-xs">{job.vehicleReg || 'N/A'}</span>
                        <span>{job.vehicleMake} {job.vehicleModel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-slate-800">£{(job.total || 0).toFixed(2)}</p>
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status || 'pending'}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Quotes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Pending Quotes</h3>
              <button 
                onClick={() => navigateTo('quotes')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>
            
            {pendingQuotes.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                <p className="text-sm">No pending quotes</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingQuotes.slice(0, 4).map((quote) => (
                  <div 
                    key={quote.id}
                    onClick={() => navigateTo('quotes', quote)}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{quote.customerName}</p>
                      <p className="text-xs text-slate-500">{quote.vehicleReg}</p>
                    </div>
                    <p className="font-bold text-amber-600">£{(quote.total || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Today's Jobs</h3>
              <button 
                onClick={() => navigateTo('calendar')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Calendar
              </button>
            </div>
            
            {todaysJobs.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                <p className="text-sm">No jobs scheduled today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysJobs.map((job) => (
                  <div 
                    key={job.id}
                    onClick={() => navigateTo('create-job', job)}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 text-sm">{job.customerName}</p>
                      <p className="text-xs text-slate-500">{job.scheduledTime || 'No time set'} • {job.vehicleReg}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
