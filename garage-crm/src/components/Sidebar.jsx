import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Briefcase, 
  Users, 
  FileText, 
  Receipt,
  Wrench,
  ChevronLeft,
  Plus,
  Settings,
  MessageSquare
} from 'lucide-react';

function Sidebar({ currentPage, navigateTo, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Garage CRM</h1>
              <p className="text-xs text-slate-500">Auto Shop Manager</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button 
            onClick={() => navigateTo('create-job')}
            className="btn-primary w-full justify-center"
          >
            <Plus className="w-5 h-5" />
            New Job
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`sidebar-link w-full ${currentPage === item.id ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Need help?</p>
            <p className="text-sm font-medium text-slate-700">Contact Support</p>
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
