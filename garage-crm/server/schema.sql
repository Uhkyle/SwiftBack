-- =============================================
-- GARAGE CRM DATABASE SCHEMAS
-- Run these in your respective databases
-- =============================================

-- =============================================
-- CUSTOMERS DATABASE (also contains enquiries)
-- =============================================

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  vehicle_reg VARCHAR(20),
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  message TEXT,
  source VARCHAR(50) DEFAULT 'website',
  status ENUM('new', 'contacted', 'converted', 'closed') DEFAULT 'new',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- JOBS DATABASE
-- =============================================

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  vehicle_reg VARCHAR(20),
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year VARCHAR(10),
  vehicle_color VARCHAR(50),
  work_required TEXT,
  notes TEXT,
  status ENUM('pending', 'in-progress', 'completed', 'quoted', 'invoiced', 'cancelled') DEFAULT 'pending',
  scheduled_date DATE,
  scheduled_time TIME,
  labour_items JSON,
  parts_items JSON,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  vat DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- QUOTES DATABASE
-- =============================================

CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  quote_number VARCHAR(50),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  vehicle_reg VARCHAR(20),
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  labour_items JSON,
  parts_items JSON,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  vat DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  status ENUM('pending', 'accepted', 'rejected', 'expired', 'converted') DEFAULT 'pending',
  notes TEXT,
  valid_until DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- INVOICES DATABASE
-- =============================================

CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  quote_id INT,
  invoice_number VARCHAR(50),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  vehicle_reg VARCHAR(20),
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  labour_items JSON,
  parts_items JSON,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  vat DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  status ENUM('unpaid', 'paid', 'overdue', 'cancelled') DEFAULT 'unpaid',
  notes TEXT,
  due_date DATE,
  paid_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- CALENDAR DATABASE
-- =============================================

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  type ENUM('job', 'appointment', 'reminder', 'blocked', 'event') DEFAULT 'event',
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  vehicle_reg VARCHAR(20),
  location VARCHAR(255),
  notes TEXT,
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  job_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- SETTINGS DATABASE
-- =============================================

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  website VARCHAR(255),
  vat_number VARCHAR(50),
  company_number VARCHAR(50),
  default_vat_rate DECIMAL(5, 2) DEFAULT 20.00,
  default_payment_terms INT DEFAULT 30,
  invoice_prefix VARCHAR(20) DEFAULT 'INV-',
  quote_prefix VARCHAR(20) DEFAULT 'QT-',
  invoice_notes TEXT,
  quote_notes TEXT,
  bank_name VARCHAR(100),
  account_number VARCHAR(20),
  sort_code VARCHAR(10),
  working_hours JSON,
  labour_rates JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- LOGINS DATABASE
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'user') DEFAULT 'user',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Create default admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123': $2a$10$rQnM1.5xQj5YY5q5YY5q5uY5q5YY5q5YY5q5YY5q5YY5q5YY5q5YY
-- INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@garage.com', '$2a$10$...', 'admin');
