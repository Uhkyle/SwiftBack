import express from 'express';
import { customersDb } from '../db.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await customersDb.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await customersDb.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;
    const [result] = await customersDb.query(
      'INSERT INTO customers (name, email, phone, address, notes, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone, address, notes]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;
    await customersDb.query(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, notes = ?, updated_at = NOW() WHERE id = ?',
      [name, email, phone, address, notes, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    await customersDb.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
