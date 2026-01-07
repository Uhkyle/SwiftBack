import express from 'express';
import { calendarDb } from '../db.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const [rows] = await calendarDb.query('SELECT * FROM events ORDER BY date ASC, start_time ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get events by date range
router.get('/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    const [rows] = await calendarDb.query(
      'SELECT * FROM events WHERE date >= ? AND date <= ? ORDER BY date ASC, start_time ASC',
      [start, end]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await calendarDb.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const {
      title, date, start_time, end_time, type, customer_name, customer_phone,
      vehicle_reg, location, notes, priority, job_id
    } = req.body;
    
    const [result] = await calendarDb.query(
      `INSERT INTO events (
        title, date, start_time, end_time, type, customer_name, customer_phone,
        vehicle_reg, location, notes, priority, job_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title, date, start_time, end_time, type || 'event', customer_name, customer_phone,
        vehicle_reg, location, notes, priority || 'normal', job_id
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const {
      title, date, start_time, end_time, type, customer_name, customer_phone,
      vehicle_reg, location, notes, priority, job_id
    } = req.body;
    
    await calendarDb.query(
      `UPDATE events SET
        title = ?, date = ?, start_time = ?, end_time = ?, type = ?,
        customer_name = ?, customer_phone = ?, vehicle_reg = ?, location = ?,
        notes = ?, priority = ?, job_id = ?, updated_at = NOW()
      WHERE id = ?`,
      [
        title, date, start_time, end_time, type, customer_name, customer_phone,
        vehicle_reg, location, notes, priority, job_id, req.params.id
      ]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    await calendarDb.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
