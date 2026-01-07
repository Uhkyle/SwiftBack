import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Save,
  Image,
  FileText,
  Clock,
  PoundSterling,
  Palette,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  CheckCircle
} from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('business');
  const [saved, setSaved] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    vatNumber: '',
    companyNumber: '',
    logo: '',
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    defaultVatRate: 20,
    defaultPaymentTerms: 30,
    invoicePrefix: 'INV-',
    quotePrefix: 'QT-',
    invoiceNotes: '',
    quoteNotes: '',
    bankName: '',
    accountNumber: '',
    sortCode: '',
  });

  const [labourRates, setLabourRates] = useState({
    standardRate: 50,
    diagnosticRate: 75,
    motRate: 40,
    weekendRate: 65,
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '13:00', closed: false },
    sunday: { open: '00:00', close: '00:00', closed: true },
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('garageCRMSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.businessInfo) setBusinessInfo(settings.businessInfo);
      if (settings.invoiceSettings) setInvoiceSettings(settings.invoiceSettings);
      if (settings.labourRates) setLabourRates(settings.labourRates);
      if (settings.workingHours) setWorkingHours(settings.workingHours);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      businessInfo,
      invoiceSettings,
      labourRates,
      workingHours,
    };
    localStorage.setItem('garageCRMSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    const data = localStorage.getItem('garageCRM');
    const settings = localStorage.getItem('garageCRMSettings');
    const exportData = {
      data: data ? JSON.parse(data) : {},
      settings: settings ? JSON.parse(settings) : {},
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garage-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.data) {
            localStorage.setItem('garageCRM', JSON.stringify(importedData.data));
          }
          if (importedData.settings) {
            localStorage.setItem('garageCRMSettings', JSON.stringify(importedData.settings));
            if (importedData.settings.businessInfo) setBusinessInfo(importedData.settings.businessInfo);
            if (importedData.settings.invoiceSettings) setInvoiceSettings(importedData.settings.invoiceSettings);
            if (importedData.settings.labourRates) setLabourRates(importedData.settings.labourRates);
            if (importedData.settings.workingHours) setWorkingHours(importedData.settings.workingHours);
          }
          alert('Data imported successfully! Please refresh the page.');
        } catch (err) {
          alert('Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      if (confirm('This will delete all jobs, customers, quotes, and invoices. Are you absolutely sure?')) {
        localStorage.removeItem('garageCRM');
        alert('All data cleared. Please refresh the page.');
      }
    }
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: Building2 },
    { id: 'invoices', label: 'Invoice Settings', icon: FileText },
    { id: 'rates', label: 'Labour Rates', icon: PoundSterling },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="card p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {/* Business Info Tab */}
            {activeTab === 'business' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Business Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Business Name</label>
                    <input
                      type="text"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      className="input-field"
                      placeholder="Your Garage Name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={businessInfo.phone}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                          className="input-field pl-10"
                          placeholder="01onal 123456"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={businessInfo.email}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                          className="input-field pl-10"
                          placeholder="info@yourgarage.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                        className="input-field pl-10"
                        rows="2"
                        placeholder="123 Main Street, Town, County, Postcode"
                      ></textarea>
                    </div>
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                        className="input-field pl-10"
                        placeholder="https://www.yourgarage.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">VAT Number</label>
                      <input
                        type="text"
                        value={businessInfo.vatNumber}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, vatNumber: e.target.value })}
                        className="input-field"
                        placeholder="GB 123456789"
                      />
                    </div>
                    <div>
                      <label className="label">Company Number</label>
                      <input
                        type="text"
                        value={businessInfo.companyNumber}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, companyNumber: e.target.value })}
                        className="input-field"
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings Tab */}
            {activeTab === 'invoices' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Invoice & Quote Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Default VAT Rate (%)</label>
                      <input
                        type="number"
                        value={invoiceSettings.defaultVatRate}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, defaultVatRate: parseFloat(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Payment Terms (Days)</label>
                      <input
                        type="number"
                        value={invoiceSettings.defaultPaymentTerms}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, defaultPaymentTerms: parseInt(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Invoice Number Prefix</label>
                      <input
                        type="text"
                        value={invoiceSettings.invoicePrefix}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Quote Number Prefix</label>
                      <input
                        type="text"
                        value={invoiceSettings.quotePrefix}
                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, quotePrefix: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Bank Details (for invoices)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="label">Bank Name</label>
                        <input
                          type="text"
                          value={invoiceSettings.bankName}
                          onChange={(e) => setInvoiceSettings({ ...invoiceSettings, bankName: e.target.value })}
                          className="input-field"
                          placeholder="Barclays"
                        />
                      </div>
                      <div>
                        <label className="label">Account Number</label>
                        <input
                          type="text"
                          value={invoiceSettings.accountNumber}
                          onChange={(e) => setInvoiceSettings({ ...invoiceSettings, accountNumber: e.target.value })}
                          className="input-field"
                          placeholder="12345678"
                        />
                      </div>
                      <div>
                        <label className="label">Sort Code</label>
                        <input
                          type="text"
                          value={invoiceSettings.sortCode}
                          onChange={(e) => setInvoiceSettings({ ...invoiceSettings, sortCode: e.target.value })}
                          className="input-field"
                          placeholder="12-34-56"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Default Invoice Notes</label>
                    <textarea
                      value={invoiceSettings.invoiceNotes}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoiceNotes: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="Thank you for your business. Payment is due within 30 days."
                    ></textarea>
                  </div>
                  <div>
                    <label className="label">Default Quote Notes</label>
                    <textarea
                      value={invoiceSettings.quoteNotes}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, quoteNotes: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="This quote is valid for 30 days. Prices exclude VAT."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Labour Rates Tab */}
            {activeTab === 'rates' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Default Labour Rates</h2>
                <p className="text-slate-500 mb-6">Set your default hourly rates for different types of work.</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="label">Standard Labour Rate</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        value={labourRates.standardRate}
                        onChange={(e) => setLabourRates({ ...labourRates, standardRate: parseFloat(e.target.value) })}
                        className="input-field pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per hour</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="label">Diagnostic Rate</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        value={labourRates.diagnosticRate}
                        onChange={(e) => setLabourRates({ ...labourRates, diagnosticRate: parseFloat(e.target.value) })}
                        className="input-field pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per hour</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="label">MOT Rate</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        value={labourRates.motRate}
                        onChange={(e) => setLabourRates({ ...labourRates, motRate: parseFloat(e.target.value) })}
                        className="input-field pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Fixed rate</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="label">Weekend/Out of Hours Rate</label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        value={labourRates.weekendRate}
                        onChange={(e) => setLabourRates({ ...labourRates, weekendRate: parseFloat(e.target.value) })}
                        className="input-field pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Per hour</p>
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours Tab */}
            {activeTab === 'hours' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Working Hours</h2>
                <p className="text-slate-500 mb-6">Set your garage's opening hours.</p>
                <div className="space-y-3">
                  {dayNames.map((day) => (
                    <div key={day} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-28">
                        <span className="font-medium text-slate-700 capitalize">{day}</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!workingHours[day].closed}
                          onChange={(e) => setWorkingHours({
                            ...workingHours,
                            [day]: { ...workingHours[day], closed: !e.target.checked }
                          })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-slate-600">Open</span>
                      </label>
                      {!workingHours[day].closed && (
                        <>
                          <input
                            type="time"
                            value={workingHours[day].open}
                            onChange={(e) => setWorkingHours({
                              ...workingHours,
                              [day]: { ...workingHours[day], open: e.target.value }
                            })}
                            className="input-field w-32 py-1.5"
                          />
                          <span className="text-slate-400">to</span>
                          <input
                            type="time"
                            value={workingHours[day].close}
                            onChange={(e) => setWorkingHours({
                              ...workingHours,
                              [day]: { ...workingHours[day], close: e.target.value }
                            })}
                            className="input-field w-32 py-1.5"
                          />
                        </>
                      )}
                      {workingHours[day].closed && (
                        <span className="text-slate-400 italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Data Management</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Download className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-800">Export Data</h3>
                        <p className="text-sm text-blue-600 mt-1">
                          Download all your data including jobs, customers, quotes, invoices, and settings.
                        </p>
                        <button onClick={handleExportData} className="btn-primary mt-3">
                          <Download className="w-4 h-4" /> Export Backup
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Upload className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800">Import Data</h3>
                        <p className="text-sm text-emerald-600 mt-1">
                          Restore your data from a previous backup file.
                        </p>
                        <label className="btn-success mt-3 cursor-pointer inline-flex">
                          <Upload className="w-4 h-4" /> Import Backup
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-800">Clear All Data</h3>
                        <p className="text-sm text-red-600 mt-1">
                          Permanently delete all jobs, customers, quotes, and invoices. This cannot be undone!
                        </p>
                        <button onClick={handleClearData} className="btn-danger mt-3">
                          <Trash2 className="w-4 h-4" /> Clear All Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <div>
                {saved && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Settings saved!</span>
                  </div>
                )}
              </div>
              <button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
