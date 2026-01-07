import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnections } from './db.js';

// Import routes
import customersRoutes from './routes/customers.js';
import jobsRoutes from './routes/jobs.js';
import quotesRoutes from './routes/quotes.js';
import invoicesRoutes from './routes/invoices.js';
import calendarRoutes from './routes/calendar.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import enquiriesRoutes from './routes/enquiries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/customers', customersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiriesRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Garage CRM API running on http://localhost:${PORT}`);
  console.log('\nTesting database connections...\n');
  await testConnections();
  console.log('\n✓ Server ready\n');
});
