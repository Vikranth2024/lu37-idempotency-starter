const { db } = require('./db');

/**
 * BROKEN STARTER:
 * - no required idempotency key
 * - no trusted scoped key record
 * - no canonical request hash
 * - no atomic duplicate claim
 * - no transaction or durable paging job
 */
async function createIncident(req, res) {
  const { title, severity, serviceId } = req.body;
  const incident = await db.one(
    `INSERT INTO incidents (tenant_id, service_id, title, severity)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.user.tenantId, serviceId, title, severity]
  );
  return res.status(201).json(incident);
}

module.exports = { createIncident };
