const { Certificate } = require('../models/index.cjs');

module.exports = {
  // Get certificate activity summary
  async getCertificateAnalytics(req, res, next) {
    try {
      const total = await Certificate.count();
      const approved = await Certificate.count({ where: { status: 'approved' } });
      const rejected = await Certificate.count({ where: { status: 'rejected' } });
      const pending = await Certificate.count({ where: { status: 'pending' } });
      res.json({ total, approved, rejected, pending });
    } catch (error) {
      next(error);
    }
  }
};
