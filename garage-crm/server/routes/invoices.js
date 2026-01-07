import express from 'express';
import { invoicesDb } from '../db.js';

const router = express.Router();

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const [rows] = await invoicesDb.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await invoicesDb.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const {
      job_id, quote_id, invoice_number, customer_name, customer_email, customer_phone,
      vehicle_reg, vehicle_make, vehicle_model,
      labour_items, parts_items, subtotal, vat, total, status, notes, due_date, paid_date
    } = req.body;
    
    const [result] = await invoicesDb.query(
      `INSERT INTO invoices (
        job_id, quote_id, invoice_number, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model,
        labour_items, parts_items, subtotal, vat, total, status, notes, due_date, paid_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        job_id, quote_id, invoice_number, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model,
        JSON.stringify(labour_items || []), JSON.stringify(parts_items || []),
        subtotal || 0, vat || 0, total || 0, status || 'unpaid', notes, due_date, paid_date
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const {
      invoice_number, customer_name, customer_email, customer_phone,
      vehicle_reg, vehicle_make, vehicle_model,
      labour_items, parts_items, subtotal, vat, total, status, notes, due_date, paid_date
    } = req.body;
    
    await invoicesDb.query(
      `UPDATE invoices SET
        invoice_number = ?, customer_name = ?, customer_email = ?, customer_phone = ?,
        vehicle_reg = ?, vehicle_make = ?, vehicle_model = ?,
        labour_items = ?, parts_items = ?, subtotal = ?, vat = ?, total = ?,
        status = ?, notes = ?, due_date = ?, paid_date = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        invoice_number, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model,
        JSON.stringify(labour_items || []), JSON.stringify(parts_items || []),
        subtotal || 0, vat || 0, total || 0, status, notes, due_date, paid_date, req.params.id
      ]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    await invoicesDb.query('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
