const { AuditLog } = require('../models/index.cjs');

module.exports = {
  // Get audit logs (paginated)
  async getAuditLogs(req, res, next) {
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
  }
};
