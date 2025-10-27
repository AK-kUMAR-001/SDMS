const { Certificate } = require('../../models/models/certificate.cjs');
const { AuditLog } = require('../../models/models/auditlog.cjs');

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const totalCertificates = await Certificate.count();
    const totalAuditLogs = await AuditLog.count();

    res.status(200).json({
      totalCertificates,
      totalAuditLogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
