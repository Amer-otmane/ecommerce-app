const express        = require('express');
const router         = express.Router();
const db             = require('../config/db');
const authMiddleware = require('../middleware/auth');

// POST /api/orders
router.post('/', authMiddleware, async (req, res) => {
  const { items } = req.body;
  const user_id   = req.user.id;

  if (!items || items.length === 0)
    return res.status(400).json({ error: 'Panier vide' });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const conn  = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [order] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?,?)',
      [user_id, total.toFixed(2)]
    );

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price) VALUES (?,?,?,?)`,
        [order.insertId, item.product_id, item.quantity, item.price]
      );
    }

    await conn.commit();
    res.status(201).json({ 
      message: 'Commande créée ✅', 
      order_id: order.insertId 
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/orders — commandes de l'utilisateur connecté
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              GROUP_CONCAT(p.title SEPARATOR ', ') as produits
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p     ON oi.product_id = p.id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET toutes les commandes SANS token (pour tester)
router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.id, o.total, o.status, o.created_at, u.name as client,
              GROUP_CONCAT(p.title SEPARATOR ', ') as produits
       FROM orders o
       LEFT JOIN users u        ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p     ON oi.product_id = p.id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;