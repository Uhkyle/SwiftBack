import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
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

// API Routes
app.use('/api/customers', customersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiriesRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

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
  console.log(`\n🚀 Garage CRM API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nTesting database connections...\n');
  await testConnections();
  console.log('\n✓ Server ready\n');
});

export default app;
