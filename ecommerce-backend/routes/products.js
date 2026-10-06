const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET tous les produits
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json({ products: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST ajouter un produit
router.post('/', async (req, res) => {
  const { title, description, price, stock, category, thumbnail } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO products 
       (title, description, price, stock, category, thumbnail) 
       VALUES (?,?,?,?,?,?)`,
      [title, description, price, stock, category, thumbnail]
    );
    res.status(201).json({ id: result.insertId, message: 'Produit créé ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT modifier un produit
router.put('/:id', async (req, res) => {
  const { title, description, price, stock, category, thumbnail } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE products SET 
       title=?, description=?, price=?, stock=?, category=?, thumbnail=?
       WHERE id=?`,
      [title, description, price, stock, category, thumbnail, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({ message: 'Produit modifié ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;