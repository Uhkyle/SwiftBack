import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  ChevronRight, 
  ChevronLeft,
  User,
  Car,
  FileText,
  Wrench,
  PoundSterling,
  Save,
  Plus,
  Trash2,
  Check,
  Calendar
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Customer Details', icon: User },
  { id: 2, name: 'Vehicle Details', icon: Car },
  { id: 3, name: 'Job Notes', icon: FileText },
  { id: 4, name: 'Labour & Parts', icon: Wrench },
  { id: 5, name: 'Review & Save', icon: PoundSterling },
];

function CreateJob({ navigateTo, editingJob }) {
  const { state, dispatch } = useCRM();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    vehicleReg: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleMileage: '',
    vehicleVIN: '',
    vehicleColor: '',
    notes: '',
    workRequired: '',
    scheduledDate: '',
    scheduledTime: '',
    status: 'pending',
    labourItems: [],
    partsItems: [],
    vatRate: 20,
    discount: 0,
    discountType: 'percentage',
  });

  useEffect(() => {
    if (editingJob) {
      setJobData({
        ...jobData,
        ...editingJob,
        labourItems: editingJob.labourItems || [],
        partsItems: editingJob.partsItems || [],
      });
    }
  }, [editingJob]);

  const updateJobData = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const addLabourItem = () => {
    setJobData(prev => ({
      ...prev,
      labourItems: [...prev.labourItems, { description: '', hours: 1, rate: 50 }]
    }));
  };

  const updateLabourItem = (index, field, value) => {
    setJobData(prev => ({
      ...prev,
      labourItems: prev.labourItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLabourItem = (index) => {
    setJobData(prev => ({
      ...prev,
      labourItems: prev.labourItems.filter((_, i) => i !== index)
    }));
  };

  const addPartItem = () => {
    setJobData(prev => ({
      ...prev,
      partsItems: [...prev.partsItems, { name: '', quantity: 1, unitPrice: 0, partNumber: '' }]
    }));
  };

  const updatePartItem = (index, field, value) => {
    setJobData(prev => ({
      ...prev,
      partsItems: prev.partsItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removePartItem = (index) => {
    setJobData(prev => ({
      ...prev,
      partsItems: prev.partsItems.filter((_, i) => i !== index)
    }));
  };

  const calculateLabourTotal = () => {
    return jobData.labourItems.reduce((sum, item) => sum + (item.hours * item.rate), 0);
  };

  const calculatePartsTotal = () => {
    return jobData.partsItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateSubtotal = () => {
    return calculateLabourTotal() + calculatePartsTotal();
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (jobData.discountType === 'percentage') {
      return subtotal * (jobData.discount / 100);
    }
    return jobData.discount;
  };

  const calculateVAT = () => {
    const subtotal = calculateSubtotal() - calculateDiscount();
    return subtotal * (jobData.vatRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateVAT();
  };

  const handleSaveJob = () => {
    const jobToSave = {
      ...jobData,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      vat: calculateVAT(),
      total: calculateTotal(),
    };

    if (editingJob) {
      dispatch({ type: 'UPDATE_JOB', payload: { id: editingJob.id, ...jobToSave } });
    } else {
      dispatch({ type: 'ADD_JOB', payload: jobToSave });
      
      const existingCustomer = state.customers.find(c => c.name === jobData.customerName);
      if (!existingCustomer && jobData.customerName) {
        dispatch({
          type: 'ADD_CUSTOMER',
          payload: {
            name: jobData.customerName,
            phone: jobData.customerPhone,
            email: jobData.customerEmail,
            address: jobData.customerAddress,
          }
        });
      }
    }

    navigateTo('jobs');
  };

  const handleSaveAsQuote = () => {
    const quoteData = {
      ...jobData,
      subtotal: calculateSubtotal(),
      discountAmount: calculateDiscount(),
      vat: calculateVAT(),
      total: calculateTotal(),
      quoteNumber: `QT-${String(state.quotes.length + 1).padStart(5, '0')}`,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    dispatch({ type: 'ADD_QUOTE', payload: quoteData });

    if (editingJob) {
      dispatch({ type: 'UPDATE_JOB', payload: { id: editingJob.id, status: 'quoted' } });
    }

    navigateTo('quotes');
  };

  const selectExistingCustomer = (customer) => {
    setJobData(prev => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone || '',
      customerEmail: customer.email || '',
      customerAddress: customer.address || '',
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h3>
              
              {state.customers.length > 0 && (
                <div className="mb-6">
                  <label className="label">Select Existing Customer</label>
                  <select
                    className="input-field"
                    onChange={(e) => {
                      const customer = state.customers.find(c => c.id === e.target.value);
                      if (customer) selectExistingCustomer(customer);
                    }}
                    value=""
                  >
                    <option value="">-- Select a customer --</option>
                    {state.customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                  <div className="text-center my-4 text-slate-400 text-sm">or enter new customer details</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Customer Name *</label>
                  <input
                    type="text"
                    value={jobData.customerName}
                    onChange={(e) => updateJobData('customerName', e.target.value)}
                    className="input-field"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    value={jobData.customerPhone}
                    onChange={(e) => updateJobData('customerPhone', e.target.value)}
                    className="input-field"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={jobData.customerEmail}
                    onChange={(e) => updateJobData('customerEmail', e.target.value)}
                    className="input-field"
                    placeholder="Email address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Address</label>
                  <textarea
                    value={jobData.customerAddress}
                    onChange={(e) => updateJobData('customerAddress', e.target.value)}
                    className="input-field"
                    rows="2"
                    placeholder="Full address"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Vehicle Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Registration Number *</label>
                <input
                  type="text"
                  value={jobData.vehicleReg}
                  onChange={(e) => updateJobData('vehicleReg', e.target.value.toUpperCase())}
                  className="input-field uppercase"
                  placeholder="e.g., AB12 CDE"
                />
              </div>
              <div>
                <label className="label">Make</label>
                <input
                  type="text"
                  value={jobData.vehicleMake}
                  onChange={(e) => updateJobData('vehicleMake', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Ford"
                />
              </div>
              <div>
                <label className="label">Model</label>
                <input
                  type="text"
                  value={jobData.vehicleModel}
                  onChange={(e) => updateJobData('vehicleModel', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Focus"
                />
              </div>
              <div>
                <label className="label">Year</label>
                <input
                  type="number"
                  value={jobData.vehicleYear}
                  onChange={(e) => updateJobData('vehicleYear', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="label">Mileage</label>
                <input
                  type="number"
                  value={jobData.vehicleMileage}
                  onChange={(e) => updateJobData('vehicleMileage', e.target.value)}
                  className="input-field"
                  placeholder="Current mileage"
                />
              </div>
              <div>
                <label className="label">Color</label>
                <input
                  type="text"
                  value={jobData.vehicleColor}
                  onChange={(e) => updateJobData('vehicleColor', e.target.value)}
                  className="input-field"
                  placeholder="Vehicle color"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="label">VIN (Optional)</label>
                <input
                  type="text"
                  value={jobData.vehicleVIN}
                  onChange={(e) => updateJobData('vehicleVIN', e.target.value.toUpperCase())}
                  className="input-field"
                  placeholder="Vehicle Identification Number"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Job Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Scheduled Date</label>
                <input
                  type="date"
                  value={jobData.scheduledDate}
                  onChange={(e) => updateJobData('scheduledDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Scheduled Time</label>
                <input
                  type="time"
                  value={jobData.scheduledTime}
                  onChange={(e) => updateJobData('scheduledTime', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Job Status</label>
                <select
                  value={jobData.status}
                  onChange={(e) => updateJobData('status', e.target.value)}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Work Required</label>
              <textarea
                value={jobData.workRequired}
                onChange={(e) => updateJobData('workRequired', e.target.value)}
                className="input-field"
                rows="4"
                placeholder="Describe the work that needs to be done..."
              ></textarea>
            </div>

            <div>
              <label className="label">Additional Notes</label>
              <textarea
                value={jobData.notes}
                onChange={(e) => updateJobData('notes', e.target.value)}
                className="input-field"
                rows="4"
                placeholder="Any additional notes, special instructions, or observations..."
              ></textarea>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Labour</h3>
                <button onClick={addLabourItem} className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" /> Add Labour
                </button>
              </div>
              
              {jobData.labourItems.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <Wrench className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-slate-500">No labour items added</p>
                  <button onClick={addLabourItem} className="btn-primary mt-3 text-sm">
                    <Plus className="w-4 h-4" /> Add First Labour Item
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobData.labourItems.map((item, index) => (
                    <div key={index} className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <label className="label">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLabourItem(index, 'description', e.target.value)}
                          className="input-field"
                          placeholder="Labour description"
                        />
                      </div>
                      <div className="w-24">
                        <label className="label">Hours</label>
                        <input
                          type="number"
                          step="0.5"
                          value={item.hours}
                          onChange={(e) => updateLabourItem(index, 'hours', parseFloat(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>
                      <div className="w-28">
                        <label className="label">Rate (£/hr)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateLabourItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>
                      <div className="w-28 text-right">
                        <label className="label">Total</label>
                        <p className="py-2.5 font-semibold text-slate-800">£{(item.hours * item.rate).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeLabourItem(index)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <div className="text-right pr-14">
                    <span className="text-slate-500">Labour Total: </span>
                    <span className="font-bold text-lg">£{calculateLabourTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-200" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Parts</h3>
                <button onClick={addPartItem} className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" /> Add Part
                </button>
              </div>
              
              {jobData.partsItems.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <Car className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-slate-500">No parts added</p>
                  <button onClick={addPartItem} className="btn-primary mt-3 text-sm">
                    <Plus className="w-4 h-4" /> Add First Part
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobData.partsItems.map((item, index) => (
                    <div key={index} className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <label className="label">Part Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updatePartItem(index, 'name', e.target.value)}
                          className="input-field"
                          placeholder="Part name"
                        />
                      </div>
                      <div className="w-32">
                        <label className="label">Part Number</label>
                        <input
                          type="text"
                          value={item.partNumber}
                          onChange={(e) => updatePartItem(index, 'partNumber', e.target.value)}
                          className="input-field"
                          placeholder="Optional"
                        />
                      </div>
                      <div className="w-20">
                        <label className="label">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updatePartItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>
                      <div className="w-28">
                        <label className="label">Unit Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updatePartItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>
                      <div className="w-28 text-right">
                        <label className="label">Total</label>
                        <p className="py-2.5 font-semibold text-slate-800">£{(item.quantity * item.unitPrice).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removePartItem(index)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <div className="text-right pr-14">
                    <span className="text-slate-500">Parts Total: </span>
                    <span className="font-bold text-lg">£{calculatePartsTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Review Job Details</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" /> Customer
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{jobData.customerName || 'Not specified'}</p>
                    <p className="text-slate-500">{jobData.customerPhone}</p>
                    <p className="text-slate-500">{jobData.customerEmail}</p>
                    <p className="text-slate-500">{jobData.customerAddress}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary-600" /> Vehicle
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Reg:</span>
                      <span className="ml-2 font-medium">{jobData.vehicleReg || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Make:</span>
                      <span className="ml-2">{jobData.vehicleMake || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Model:</span>
                      <span className="ml-2">{jobData.vehicleModel || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Year:</span>
                      <span className="ml-2">{jobData.vehicleYear || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Mileage:</span>
                      <span className="ml-2">{jobData.vehicleMileage || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Color:</span>
                      <span className="ml-2">{jobData.vehicleColor || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {(jobData.workRequired || jobData.notes) && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600" /> Notes
                    </h4>
                    {jobData.workRequired && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 uppercase font-medium mb-1">Work Required</p>
                        <p className="text-sm">{jobData.workRequired}</p>
                      </div>
                    )}
                    {jobData.notes && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium mb-1">Additional Notes</p>
                        <p className="text-sm">{jobData.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-medium text-slate-800 mb-4">Price Breakdown</h4>
                  
                  {jobData.labourItems.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 uppercase font-medium mb-2">Labour</p>
                      {jobData.labourItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm py-1">
                          <span className="text-slate-600">{item.description || 'Labour'} ({item.hours}h × £{item.rate})</span>
                          <span>£{(item.hours * item.rate).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {jobData.partsItems.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 uppercase font-medium mb-2">Parts</p>
                      {jobData.partsItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm py-1">
                          <span className="text-slate-600">{item.name || 'Part'} ({item.quantity} × £{item.unitPrice})</span>
                          <span>£{(item.quantity * item.unitPrice).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span>£{calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 whitespace-nowrap">Discount</span>
                      <input
                        type="number"
                        value={jobData.discount}
                        onChange={(e) => updateJobData('discount', parseFloat(e.target.value) || 0)}
                        className="input-field py-1 px-2 w-20 text-sm"
                      />
                      <select
                        value={jobData.discountType}
                        onChange={(e) => updateJobData('discountType', e.target.value)}
                        className="input-field py-1 px-2 w-20 text-sm"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">£</option>
                      </select>
                      <span className="ml-auto text-sm">-£{calculateDiscount().toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 whitespace-nowrap">VAT</span>
                      <input
                        type="number"
                        value={jobData.vatRate}
                        onChange={(e) => updateJobData('vatRate', parseFloat(e.target.value) || 0)}
                        className="input-field py-1 px-2 w-20 text-sm"
                      />
                      <span className="text-sm text-slate-500">%</span>
                      <span className="ml-auto text-sm">£{calculateVAT().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-primary-600">£{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button onClick={handleSaveJob} className="btn-primary w-full justify-center py-3">
                    <Save className="w-5 h-5" />
                    {editingJob ? 'Update Job' : 'Save Job'}
                  </button>
                  <button onClick={handleSaveAsQuote} className="btn-success w-full justify-center py-3">
                    <FileText className="w-5 h-5" />
                    Save as Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : isCompleted 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-white/20' 
                      : isCompleted 
                        ? 'bg-emerald-200'
                        : 'bg-slate-200'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="hidden md:inline font-medium">{step.name}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="card">
        {renderStepContent()}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>
          
          {currentStep < 5 ? (
            <button onClick={nextStep} className="btn-primary">
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => navigateTo('jobs')} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateJob;
