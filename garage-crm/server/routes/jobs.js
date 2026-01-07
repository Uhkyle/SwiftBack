import express from 'express';
import { jobsDb } from '../db.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const [rows] = await jobsDb.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await jobsDb.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Create job
router.post('/', async (req, res) => {
  try {
    const {
      customer_id, customer_name, customer_email, customer_phone,
      vehicle_reg, vehicle_make, vehicle_model, vehicle_year, vehicle_color,
      work_required, notes, status, scheduled_date, scheduled_time,
      labour_items, parts_items, subtotal, vat, total
    } = req.body;
    
    const [result] = await jobsDb.query(
      `INSERT INTO jobs (
        customer_id, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model, vehicle_year, vehicle_color,
        work_required, notes, status, scheduled_date, scheduled_time,
        labour_items, parts_items, subtotal, vat, total, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        customer_id, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model, vehicle_year, vehicle_color,
        work_required, notes, status || 'pending', scheduled_date, scheduled_time,
        JSON.stringify(labour_items || []), JSON.stringify(parts_items || []),
        subtotal || 0, vat || 0, total || 0
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const {
      customer_id, customer_name, customer_email, customer_phone,
      vehicle_reg, vehicle_make, vehicle_model, vehicle_year, vehicle_color,
      work_required, notes, status, scheduled_date, scheduled_time,
      labour_items, parts_items, subtotal, vat, total
    } = req.body;
    
    await jobsDb.query(
      `UPDATE jobs SET
        customer_id = ?, customer_name = ?, customer_email = ?, customer_phone = ?,
        vehicle_reg = ?, vehicle_make = ?, vehicle_model = ?, vehicle_year = ?, vehicle_color = ?,
        work_required = ?, notes = ?, status = ?, scheduled_date = ?, scheduled_time = ?,
        labour_items = ?, parts_items = ?, subtotal = ?, vat = ?, total = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        customer_id, customer_name, customer_email, customer_phone,
        vehicle_reg, vehicle_make, vehicle_model, vehicle_year, vehicle_color,
        work_required, notes, status, scheduled_date, scheduled_time,
        JSON.stringify(labour_items || []), JSON.stringify(parts_items || []),
        subtotal || 0, vat || 0, total || 0, req.params.id
      ]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    await jobsDb.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
