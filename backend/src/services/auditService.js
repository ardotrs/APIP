const db = require('../config/db');

const logAudit = async ({ userId, action, entityType, entityId, metadata }) => {
  await db.query(
    `INSERT INTO audit_trails (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId || null, action, entityType, entityId || null, metadata || null]
  );
};

module.exports = {
  logAudit,
};
