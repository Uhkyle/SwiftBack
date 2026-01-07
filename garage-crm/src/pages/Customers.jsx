import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Plus, 
  Search, 
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Edit,
  Trash2,
  X,
  MoreVertical
} from 'lucide-react';

function Customers({ navigateTo }) {
  const { state, dispatch } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const filteredCustomers = state.customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const getCustomerJobs = (customerName) => {
    return state.jobs.filter(job => job.customerName === customerName);
  };

  const getCustomerVehicles = (customerName) => {
    const jobs = getCustomerJobs(customerName);
    const vehicleMap = new Map();
    jobs.forEach(job => {
      if (job.vehicleReg) {
        vehicleMap.set(job.vehicleReg, {
          reg: job.vehicleReg,
          make: job.vehicleMake,
          model: job.vehicleModel,
        });
      }
    });
    return Array.from(vehicleMap.values());
  };

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustomerForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        notes: customer.notes || '',
      });
    } else {
      setEditingCustomer(null);
      setCustomerForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      });
    }
    setShowModal(true);
    setShowMenu(null);
  };

  const handleSaveCustomer = () => {
    if (!customerForm.name) return;

    if (editingCustomer) {
      dispatch({
        type: 'UPDATE_CUSTOMER',
        payload: { id: editingCustomer.id, ...customerForm }
      });
    } else {
      dispatch({
        type: 'ADD_CUSTOMER',
        payload: customerForm
      });
    }
    setShowModal(false);
  };

  const handleDeleteCustomer = (customerId) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      dispatch({ type: 'DELETE_CUSTOMER', payload: customerId });
    }
    setShowMenu(null);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            <Plus className="w-5 h-5" /> Add Customer
          </button>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 mb-4">No customers found</p>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              <Plus className="w-5 h-5" /> Add Your First Customer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => {
              const jobs = getCustomerJobs(customer.name);
              const vehicles = getCustomerVehicles(customer.name);
              
              return (
                <div key={customer.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                        <p className="text-sm text-slate-500">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setShowMenu(showMenu === customer.id ? null : customer.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-500" />
                      </button>
                      {showMenu === customer.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                          <button 
                            onClick={() => handleOpenModal(customer)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {customer.address}
                      </div>
                    )}
                  </div>

                  {vehicles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-2">VEHICLES</p>
                      <div className="flex flex-wrap gap-2">
                        {vehicles.map((vehicle, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-700"
                          >
                            <Car className="w-3 h-3" />
                            {vehicle.reg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="input-field"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="input-field"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  className="input-field"
                  rows="2"
                  placeholder="Full address"
                ></textarea>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  className="input-field"
                  rows="2"
                  placeholder="Any additional notes..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSaveCustomer} className="btn-primary flex-1">
                {editingCustomer ? 'Update' : 'Add'} Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
