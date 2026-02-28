const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logAudit } = require('../services/auditService');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await db.query(
      'SELECT id, username, password_hash, role, full_name FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await logAudit({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'users',
      entityId: user.id,
    });

    return res.json({ token, user: { id: user.id, role: user.role, fullName: user.full_name } });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
};
