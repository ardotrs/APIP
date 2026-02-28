const db = require('../config/db');
const { logAudit } = require('../services/auditService');

const listEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const employees = await db.query(
      `SELECT id, nip, full_name, position, division, is_active, created_at
       FROM employees
       WHERE full_name ILIKE $1 OR nip ILIKE $1
       ORDER BY full_name ASC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, Number(limit), offset]
    );

    const total = await db.query(
      'SELECT COUNT(*) FROM employees WHERE full_name ILIKE $1 OR nip ILIKE $1',
      [`%${search}%`]
    );

    return res.json({
      data: employees.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total.rows[0].count),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { nip, fullName, position, division, isActive } = req.body;
    const result = await db.query(
      `INSERT INTO employees (nip, full_name, position, division, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nip, full_name, position, division, is_active`,
      [nip, fullName, position, division, isActive]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CREATE',
      entityType: 'employees',
      entityId: result.rows[0].id,
      metadata: result.rows[0],
    });

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listEmployees,
  createEmployee,
};
