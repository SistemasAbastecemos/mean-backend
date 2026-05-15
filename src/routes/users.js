const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ── GET /api/users — listar todos ────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// ── GET /api/users/:id — obtener uno ─────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// ── POST /api/users — crear ───────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    const msg = Object.values(err.errors || {}).map(e => e.message).join(', ');
    res.status(422).json({ error: msg || 'Datos inválidos' });
  }
});

// ── PUT /api/users/:id — actualizar ──────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    const msg = Object.values(err.errors || {}).map(e => e.message).join(', ');
    res.status(422).json({ error: msg || 'Datos inválidos' });
  }
});

// ── DELETE /api/users/:id — eliminar ─────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
