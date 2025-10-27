const { AuditLog } = require('../../models/models/auditlog.cjs');

// Get all audit logs
exports.getAllAuditLogs = async (req, res) => {
  try {
    const auditLogs = await AuditLog.findAll();
    res.status(200).json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get audit logs (paginated)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const { count, rows } = await AuditLog.findAndCountAll({
      order: [['timestamp', 'DESC']],
      limit: pageSize,
      offset
    });
    res.json({
      logs: rows,
      totalCount: count
    });
  } catch (error) {
    next(error);
  }
};
