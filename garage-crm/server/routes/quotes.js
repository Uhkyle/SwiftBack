import express from 'express';
import { quotesDb } from '../db.js';

const router = express.Router();

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const [rows] = await quotesDb.query('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Get single quote
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await quotesDb.query('SELECT * FROM quotes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Create quote
router.post('/', async (req, res) => {
  try {
    const {
      job_id, quote_number, customer_name, customer_email, customer_phone,
      vehicle_reg, vehicle_make, vehicle_model,
      labour_items, parts_items, subtotal, vat, total, status, notes, valid_until
    } = req.body;
    
    const [result] = await quotesDb.query(
      `INSERT INTO quotes (
        job_id, quote_number, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model,
        labour_items, parts_items, subtotal, vat, total, status, notes, valid_until, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        job_id, quote_number, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model,
        JSON.stringify(labour_items || []), JSON.stringify(parts_items || []),
        subtotal || 0, vat || 0, total || 0, status || 'pending', notes, valid_until
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// Update quote
router.put('/:id', async (req, res) => {
  try {
    const {
      quote_number, customer_name, customer_email, customer_phone,
      vehicle_reg, vehicle_make, vehicle_model,
      labour_items, parts_items, subtotal, vat, total, status, notes, valid_until
    } = req.body;
    
    await quotesDb.query(
      `UPDATE quotes SET
        quote_number = ?, customer_name = ?, customer_email = ?, customer_phone = ?,
        vehicle_reg = ?, vehicle_make = ?, vehicle_model = ?,
        labour_items = ?, parts_items = ?, subtotal = ?, vat = ?, total = ?,
        status = ?, notes = ?, valid_until = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        quote_number, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model,
        JSON.stringify(labour_items || []), JSON.stringify(parts_items || []),
        subtotal || 0, vat || 0, total || 0, status, notes, valid_until, req.params.id
      ]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Delete quote
router.delete('/:id', async (req, res) => {
  try {
    await quotesDb.query('DELETE FROM quotes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
