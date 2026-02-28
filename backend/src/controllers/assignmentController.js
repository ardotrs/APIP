const db = require('../config/db');
const { logAudit } = require('../services/auditService');

const listAssignments = async (req, res, next) => {
  try {
    const { status, teamName, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const filters = [];
    const values = [];

    if (status) {
      values.push(status);
      filters.push(`a.status = $${values.length}`);
    }
    if (teamName) {
      values.push(`%${teamName}%`);
      filters.push(`a.team_name ILIKE $${values.length}`);
    }
    if (startDate) {
      values.push(startDate);
      filters.push(`a.start_date >= $${values.length}`);
    }
    if (endDate) {
      values.push(endDate);
      filters.push(`a.end_date <= $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    values.push(Number(limit));
    values.push(offset);

    const query = `
      SELECT a.id, a.letter_number, a.letter_date, a.activity_name, a.location,
             a.start_date, a.end_date, a.team_name, a.status, e.full_name AS leader_name
      FROM assignments a
      LEFT JOIN employees e ON e.id = a.leader_id
      ${whereClause}
      ORDER BY a.start_date DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await db.query(query, values);
    return res.json(result.rows);
  } catch (error) {
    return next(error);
  }
};

const createAssignment = async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const {
      letterNumber,
      letterDate,
      activityName,
      location,
      startDate,
      endDate,
      teamName,
      leaderId,
      memberIds,
      status,
      overrideConflict,
    } = req.body;

    const participantIds = [...new Set([leaderId, ...memberIds])];

    const conflictCheck = await client.query(
      `SELECT a.id, a.letter_number, a.start_date, a.end_date, atm.employee_id
       FROM assignments a
       JOIN assignment_team_members atm ON atm.assignment_id = a.id
       WHERE atm.employee_id = ANY($1)
         AND a.status != 'Dibatalkan'
         AND daterange(a.start_date, a.end_date, '[]') && daterange($2::date, $3::date, '[]')`,
      [participantIds, startDate, endDate]
    );

    if (conflictCheck.rows.length && !(overrideConflict && req.user.role === 'Admin')) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        message: 'Terdapat pegawai dengan jadwal tumpang tindih',
        conflicts: conflictCheck.rows,
      });
    }

    const assignmentInsert = await client.query(
      `INSERT INTO assignments (
        letter_number, letter_date, activity_name, location, start_date, end_date,
        team_name, leader_id, status, document_path, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        letterNumber,
        letterDate,
        activityName,
        location,
        startDate,
        endDate,
        teamName,
        leaderId,
        status,
        req.file ? req.file.path : null,
        req.user.id,
      ]
    );

    for (const employeeId of participantIds) {
      await client.query(
        `INSERT INTO assignment_team_members (assignment_id, employee_id)
         VALUES ($1, $2)`,
        [assignmentInsert.rows[0].id, employeeId]
      );
    }

    await client.query('COMMIT');

    await logAudit({
      userId: req.user.id,
      action: 'CREATE',
      entityType: 'assignments',
      entityId: assignmentInsert.rows[0].id,
      metadata: { participantIds, overrideConflict: !!overrideConflict },
    });

    return res.status(201).json(assignmentInsert.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  listAssignments,
  createAssignment,
};
