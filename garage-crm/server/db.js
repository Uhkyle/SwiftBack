import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pools for each database
const createPool = (host, user, password, database, port = 3306) => {
  return mysql.createPool({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

// Database pools - each connects to a separate IONOS database
export const enquiriesDb = createPool(
  process.env.DB_ENQUIRIES_HOST,
  process.env.DB_ENQUIRIES_USER,
  process.env.DB_ENQUIRIES_PASSWORD,
  process.env.DB_ENQUIRIES_NAME,
  process.env.DB_ENQUIRIES_PORT
);

export const customersDb = createPool(
  process.env.DB_CUSTOMERS_HOST,
  process.env.DB_CUSTOMERS_USER,
  process.env.DB_CUSTOMERS_PASSWORD,
  process.env.DB_CUSTOMERS_NAME,
  process.env.DB_CUSTOMERS_PORT
);

export const jobsDb = createPool(
  process.env.DB_JOBS_HOST,
  process.env.DB_JOBS_USER,
  process.env.DB_JOBS_PASSWORD,
  process.env.DB_JOBS_NAME,
  process.env.DB_JOBS_PORT
);

export const quotesDb = createPool(
  process.env.DB_QUOTES_HOST,
  process.env.DB_QUOTES_USER,
  process.env.DB_QUOTES_PASSWORD,
  process.env.DB_QUOTES_NAME,
  process.env.DB_QUOTES_PORT
);

export const invoicesDb = createPool(
  process.env.DB_INVOICES_HOST,
  process.env.DB_INVOICES_USER,
  process.env.DB_INVOICES_PASSWORD,
  process.env.DB_INVOICES_NAME,
  process.env.DB_INVOICES_PORT
);

export const calendarDb = createPool(
  process.env.DB_CALENDAR_HOST,
  process.env.DB_CALENDAR_USER,
  process.env.DB_CALENDAR_PASSWORD,
  process.env.DB_CALENDAR_NAME,
  process.env.DB_CALENDAR_PORT
);

export const settingsDb = createPool(
  process.env.DB_SETTINGS_HOST,
  process.env.DB_SETTINGS_USER,
  process.env.DB_SETTINGS_PASSWORD,
  process.env.DB_SETTINGS_NAME,
  process.env.DB_SETTINGS_PORT
);

export const loginsDb = createPool(
  process.env.DB_LOGINS_HOST,
  process.env.DB_LOGINS_USER,
  process.env.DB_LOGINS_PASSWORD,
  process.env.DB_LOGINS_NAME,
  process.env.DB_LOGINS_PORT
);

// Test all connections
export async function testConnections() {
  const databases = [
    { name: 'Enquiries', pool: enquiriesDb },
    { name: 'Customers', pool: customersDb },
    { name: 'Jobs', pool: jobsDb },
    { name: 'Quotes', pool: quotesDb },
    { name: 'Invoices', pool: invoicesDb },
    { name: 'Calendar', pool: calendarDb },
    { name: 'Settings', pool: settingsDb },
    { name: 'Logins', pool: loginsDb },
  ];

  for (const db of databases) {
    try {
      const conn = await db.pool.getConnection();
      console.log(`✓ Connected to ${db.name} database`);
      conn.release();
    } catch (error) {
      console.error(`✗ Failed to connect to ${db.name}:`, error.message);
    }
  }
}
