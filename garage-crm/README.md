# Garage CRM - Professional Auto Shop Management

A modern, feature-rich Customer Relationship Management system designed specifically for automotive garages and repair shops.

## Features

### 📊 Dashboard
- Overview of active jobs, customers, quotes, and invoices
- Revenue tracking for paid invoices
- Quick access to recent jobs and pending quotes

### 📅 Calendar
- Monthly calendar view with job scheduling
- Add custom events (appointments, reminders, blocked time)
- View scheduled jobs directly on the calendar
- Click any date to see/add events

### 🔧 Jobs Management
- **Complete Job Workflow:**
  1. **Customer Details** - Add new or select existing customers
  2. **Vehicle Details** - Registration, make, model, year, mileage, VIN
  3. **Job Notes** - Work required, additional notes, scheduling
  4. **Labour & Parts** - Add labour items with hourly rates, parts with quantities
  5. **Review & Save** - Price breakdown with VAT and discounts

- Job status tracking (Pending, In Progress, Completed, Cancelled)
- Search and filter jobs
- Edit existing jobs

### 👥 Customers
- Customer database with contact information
- View customer job history
- Track vehicles per customer
- Add/edit customer details

### 📝 Quotes
- Generate quotes from jobs
- Quote status management (Pending, Accepted, Rejected, Expired)
- **Convert quotes to invoices** with one click
- View detailed quote breakdowns
- Print/send quotes (UI ready)

### 💰 Invoices
- Professional invoice generation from quotes
- Invoice status tracking (Unpaid, Paid, Partial, Overdue)
- Overdue invoice highlighting
- Mark invoices as paid
- Print/PDF/Email options (UI ready)
- Revenue tracking

### 💾 Data Persistence
- All data automatically saved to browser localStorage
- No database required - works offline

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Navigate to the project folder:
   ```bash
   cd garage-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Project Structure

```
garage-crm/
├── src/
│   ├── components/
│   │   └── Sidebar.jsx        # Navigation sidebar
│   ├── context/
│   │   └── CRMContext.jsx     # Global state management
│   ├── pages/
│   │   ├── Dashboard.jsx      # Home dashboard
│   │   ├── Calendar.jsx       # Calendar & scheduling
│   │   ├── Jobs.jsx           # Jobs list
│   │   ├── CreateJob.jsx      # Job creation wizard
│   │   ├── Customers.jsx      # Customer management
│   │   ├── Quotes.jsx         # Quotes management
│   │   └── Invoices.jsx       # Invoice management
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Usage Guide

### Creating a Job
1. Click "New Job" in the sidebar
2. Fill in customer details (or select existing)
3. Enter vehicle information
4. Add job notes and schedule
5. Add labour items and parts
6. Review pricing and save

### Converting Quote to Invoice
1. Go to Quotes page
2. Click the menu (⋮) on any quote
3. Select "Convert to Invoice"
4. The quote status changes to "Converted"
5. New invoice appears in Invoices page

### Managing Invoices
1. Go to Invoices page
2. View invoice details
3. Mark as Paid/Partial when payment received
4. Print or email to customer

## Deployment to IONOS

### Prerequisites
- GitHub repository connected to IONOS
- IONOS Web Hosting Plus account
- Node.js support enabled

### Environment Variables (set in IONOS)
```
NODE_ENV=production
PORT=3001
DB_ENQUIRIES_HOST=your-db-host
DB_ENQUIRIES_PORT=3306
DB_ENQUIRIES_USER=your-user
DB_ENQUIRIES_PASSWORD=your-password
DB_ENQUIRIES_NAME=your-db-name
# ... (repeat for all databases)
JWT_SECRET=your-secret-key
```

### Build Commands
```bash
npm install
npm run build
cd server && npm install
```

### Start Command
```bash
cd server && npm start
```

## License

MIT License - feel free to use for your garage business!
