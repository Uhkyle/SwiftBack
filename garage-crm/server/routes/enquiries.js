import express from 'express';
import { enquiriesDb } from '../db.js';

const router = express.Router();

// Get all enquiries
router.get('/', async (req, res) => {
  try {
    const [rows] = await enquiriesDb.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Get single enquiry
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await enquiriesDb.query('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

// Create enquiry (public endpoint for website forms)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, vehicle_reg, vehicle_make, vehicle_model, message, source } = req.body;
    
    const [result] = await enquiriesDb.query(
      `INSERT INTO enquiries (
        name, email, phone, vehicle_reg, vehicle_make, vehicle_model, message, source, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [name, email, phone, vehicle_reg, vehicle_make, vehicle_model, message, source || 'website']
    );
    
    res.status(201).json({ id: result.insertId, status: 'new', ...req.body });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
});

// Update enquiry status
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    await enquiriesDb.query(
      'UPDATE enquiries SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?',
      [status, notes, req.params.id]
    );
    
    res.json({ id: req.params.id, status, notes });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Delete enquiry
router.delete('/:id', async (req, res) => {
  try {
    await enquiriesDb.query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
