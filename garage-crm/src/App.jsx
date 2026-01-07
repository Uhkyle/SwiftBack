import React, { useState } from 'react';
import { CRMProvider } from './context/CRMContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import Customers from './pages/Customers';
import Quotes from './pages/Quotes';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Enquiries from './pages/Enquiries';
import Login from './pages/Login';
import { Menu, LogOut } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'create-job' && data) {
      setEditingJob(data);
    } else if (page !== 'create-job') {
      setEditingJob(null);
    }
    if (page === 'quotes' && data) {
      setViewingQuote(data);
    }
    if (page === 'invoices' && data) {
      setViewingInvoice(data);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'calendar':
        return <Calendar navigateTo={navigateTo} />;
      case 'jobs':
        return <Jobs navigateTo={navigateTo} />;
      case 'create-job':
        return <CreateJob navigateTo={navigateTo} editingJob={editingJob} />;
      case 'customers':
        return <Customers navigateTo={navigateTo} />;
      case 'quotes':
        return <Quotes navigateTo={navigateTo} viewingQuote={viewingQuote} setViewingQuote={setViewingQuote} />;
      case 'invoices':
        return <Invoices navigateTo={navigateTo} viewingInvoice={viewingInvoice} setViewingInvoice={setViewingInvoice} />;
      case 'settings':
        return <Settings />;
      case 'enquiries':
        return <Enquiries navigateTo={navigateTo} />;
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  return (
    <CRMProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar 
          currentPage={currentPage} 
          navigateTo={navigateTo} 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {currentPage === 'dashboard' && 'Dashboard'}
                  {currentPage === 'calendar' && 'Calendar'}
                  {currentPage === 'jobs' && 'Jobs'}
                  {currentPage === 'create-job' && (editingJob ? 'Edit Job' : 'Create New Job')}
                  {currentPage === 'customers' && 'Customers'}
                  {currentPage === 'quotes' && 'Quotes'}
                  {currentPage === 'invoices' && 'Invoices'}
                  {currentPage === 'settings' && 'Settings'}
                  {currentPage === 'enquiries' && 'Enquiries'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Welcome, <span className="font-semibold">{user?.username || user?.email}</span>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </CRMProvider>
  );
}

// Wrap AppContent with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
