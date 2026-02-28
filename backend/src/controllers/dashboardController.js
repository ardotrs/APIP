const db = require('../config/db');

const getDashboard = async (req, res, next) => {
  try {
    const monthlyAssignments = await db.query(
      `SELECT to_char(start_date, 'YYYY-MM') AS month, COUNT(*) AS total
       FROM assignments
       GROUP BY month
       ORDER BY month`
    );

    const assignmentsByEmployee = await db.query(
      `SELECT e.full_name, COUNT(atm.assignment_id) AS total
       FROM employees e
       LEFT JOIN assignment_team_members atm ON atm.employee_id = e.id
       GROUP BY e.full_name
       ORDER BY total DESC
       LIMIT 10`
    );

    const activeAssignments = await db.query(
      `SELECT id, activity_name, team_name, start_date, end_date, status
       FROM assignments
       WHERE status IN ('Perencanaan', 'Berjalan')
       ORDER BY start_date ASC`
    );

    return res.json({
      monthlyAssignments: monthlyAssignments.rows,
      assignmentsByEmployee: assignmentsByEmployee.rows,
      activeAssignments: activeAssignments.rows,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboard,
};
