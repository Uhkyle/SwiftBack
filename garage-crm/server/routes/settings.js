import express from 'express';
import { settingsDb } from '../db.js';

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await settingsDb.query('SELECT * FROM settings LIMIT 1');
    if (rows.length === 0) {
      return res.json({});
    }
    // Parse JSON fields
    const settings = rows[0];
    if (settings.working_hours) settings.working_hours = JSON.parse(settings.working_hours);
    if (settings.labour_rates) settings.labour_rates = JSON.parse(settings.labour_rates);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update or create settings
router.put('/', async (req, res) => {
  try {
    const {
      business_name, phone, email, address, website, vat_number, company_number,
      default_vat_rate, default_payment_terms, invoice_prefix, quote_prefix,
      invoice_notes, quote_notes, bank_name, account_number, sort_code,
      working_hours, labour_rates
    } = req.body;

    // Check if settings exist
    const [existing] = await settingsDb.query('SELECT id FROM settings LIMIT 1');
    
    if (existing.length > 0) {
      // Update
      await settingsDb.query(
        `UPDATE settings SET
          business_name = ?, phone = ?, email = ?, address = ?, website = ?,
          vat_number = ?, company_number = ?, default_vat_rate = ?, default_payment_terms = ?,
          invoice_prefix = ?, quote_prefix = ?, invoice_notes = ?, quote_notes = ?,
          bank_name = ?, account_number = ?, sort_code = ?,
          working_hours = ?, labour_rates = ?, updated_at = NOW()
        WHERE id = ?`,
        [
          business_name, phone, email, address, website,
          vat_number, company_number, default_vat_rate, default_payment_terms,
          invoice_prefix, quote_prefix, invoice_notes, quote_notes,
          bank_name, account_number, sort_code,
          JSON.stringify(working_hours), JSON.stringify(labour_rates),
          existing[0].id
        ]
      );
    } else {
      // Insert
      await settingsDb.query(
        `INSERT INTO settings (
          business_name, phone, email, address, website,
          vat_number, company_number, default_vat_rate, default_payment_terms,
          invoice_prefix, quote_prefix, invoice_notes, quote_notes,
          bank_name, account_number, sort_code,
          working_hours, labour_rates, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          business_name, phone, email, address, website,
          vat_number, company_number, default_vat_rate, default_payment_terms,
          invoice_prefix, quote_prefix, invoice_notes, quote_notes,
          bank_name, account_number, sort_code,
          JSON.stringify(working_hours), JSON.stringify(labour_rates)
        ]
      );
    }
    
    res.json({ message: 'Settings saved', ...req.body });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
