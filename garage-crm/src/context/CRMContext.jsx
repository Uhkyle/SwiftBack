import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CRMContext = createContext();

const initialState = {
  jobs: [],
  customers: [],
  quotes: [],
  invoices: [],
  calendarEvents: [],
  enquiries: [],
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function crmReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, { ...action.payload, id: generateId(), createdAt: new Date().toISOString() }] };

    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(job => job.id === action.payload.id ? { ...job, ...action.payload } : job) };

    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter(job => job.id !== action.payload) };

    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, { ...action.payload, id: generateId(), createdAt: new Date().toISOString() }] };

    case 'UPDATE_CUSTOMER':
      return { ...state, customers: state.customers.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };

    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter(c => c.id !== action.payload) };

    case 'ADD_QUOTE':
      return { ...state, quotes: [...state.quotes, { ...action.payload, id: generateId(), createdAt: new Date().toISOString(), status: 'pending' }] };

    case 'UPDATE_QUOTE':
      return { ...state, quotes: state.quotes.map(q => q.id === action.payload.id ? { ...q, ...action.payload } : q) };

    case 'DELETE_QUOTE':
      return { ...state, quotes: state.quotes.filter(q => q.id !== action.payload) };

    case 'CONVERT_QUOTE_TO_INVOICE':
      const quote = state.quotes.find(q => q.id === action.payload);
      if (!quote) return state;
      const newInvoice = {
        ...quote,
        id: generateId(),
        quoteId: quote.id,
        invoiceNumber: `INV-${String(state.invoices.length + 1).padStart(5, '0')}`,
        createdAt: new Date().toISOString(),
        status: 'unpaid',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      return {
        ...state,
        quotes: state.quotes.map(q => q.id === action.payload ? { ...q, status: 'converted' } : q),
        invoices: [...state.invoices, newInvoice],
      };

    case 'UPDATE_INVOICE':
      return { ...state, invoices: state.invoices.map(inv => inv.id === action.payload.id ? { ...inv, ...action.payload } : inv) };

    case 'DELETE_INVOICE':
      return { ...state, invoices: state.invoices.filter(inv => inv.id !== action.payload) };

    case 'ADD_CALENDAR_EVENT':
      return { ...state, calendarEvents: [...state.calendarEvents, { ...action.payload, id: generateId() }] };

    case 'UPDATE_CALENDAR_EVENT':
      return { ...state, calendarEvents: state.calendarEvents.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e) };

    case 'DELETE_CALENDAR_EVENT':
      return { ...state, calendarEvents: state.calendarEvents.filter(e => e.id !== action.payload) };

    case 'ADD_ENQUIRY':
      return { ...state, enquiries: [...state.enquiries, { ...action.payload, id: generateId(), createdAt: new Date().toISOString(), status: 'new' }] };

    case 'UPDATE_ENQUIRY':
      return { ...state, enquiries: state.enquiries.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e) };

    case 'DELETE_ENQUIRY':
      return { ...state, enquiries: state.enquiries.filter(e => e.id !== action.payload) };

    case 'CONVERT_ENQUIRY_TO_JOB':
      const enquiry = state.enquiries.find(e => e.id === action.payload);
      if (!enquiry) return state;
      const newJob = {
        id: generateId(),
        customerName: enquiry.name,
        customerEmail: enquiry.email,
        customerPhone: enquiry.phone,
        vehicleReg: enquiry.vehicleReg || '',
        vehicleMake: enquiry.vehicleMake || '',
        vehicleModel: enquiry.vehicleModel || '',
        workRequired: enquiry.message,
        status: 'pending',
        createdAt: new Date().toISOString(),
        enquiryId: enquiry.id,
      };
      return {
        ...state,
        enquiries: state.enquiries.map(e => e.id === action.payload ? { ...e, status: 'converted' } : e),
        jobs: [...state.jobs, newJob],
      };

    default:
      return state;
  }
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('garageCRM');
    if (savedState) {
      try {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('garageCRM', JSON.stringify(state));
  }, [state]);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}

export default CRMContext;
