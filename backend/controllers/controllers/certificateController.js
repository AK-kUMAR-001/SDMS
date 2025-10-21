const { Certificate, User, AuditLog, LeaderboardEntry } = require('../models/index.cjs');

module.exports = {
  // Get all certificates
  async getAllCertificates(req, res, next) {
    try {
      const certificates = await Certificate.findAll({ include: [User] });
      res.json(certificates);
    } catch (error) {
      next(error);
    }
  },

  // Get certificates by student ID
  async getCertificatesByStudentId(req, res, next) {
    try {
      const studentCerts = await Certificate.findAll({ where: { studentId: req.params.studentId } });
      res.json(studentCerts);
    } catch (error) {
      next(error);
    }
  },

  // Create certificate
  async createCertificate(req, res, next) {
    try {
      const newCert = await Certificate.create({
        ...req.body,
        status: 'pending',
        points: 0,
        submitted_at: new Date()
      });
      res.status(201).json(newCert);
    } catch (error) {
      next(error);
    }
  },

  // Update certificate status
  async updateCertificateStatus(req, res, next) {
    try {
      const certificate = await Certificate.findByPk(req.params.id);
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      const currentStatus = certificate.status;
      const newStatus = req.body.status;
      if (currentStatus !== 'pending' || !['approved', 'rejected'].includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status transition' });
      }
      if (newStatus === 'approved') {
        if (typeof req.body.points !== 'number' || req.body.points <= 0) {
          return res.status(400).json({ error: 'Points are required and must be > 0 for approval' });
        }
      }
      if (newStatus === 'rejected') {
        if (!req.body.rejectionReason || req.body.rejectionReason.trim() === '') {
          return res.status(400).json({ error: 'Rejection reason is required for rejection' });
        }
      }
      await certificate.update(req.body);
      if (newStatus === 'approved') {
        const totalPoints = await Certificate.sum('points', { where: { studentId: certificate.studentId, status: 'approved' } });
        let entry = await LeaderboardEntry.findOne({ where: { studentId: certificate.studentId } });
        if (entry) {
          await entry.update({ points: totalPoints });
        } else {
          await LeaderboardEntry.create({ studentId: certificate.studentId, points: totalPoints, rank: null });
        }
      } else if (newStatus === 'rejected') {
        const totalPoints = await Certificate.sum('points', { where: { studentId: certificate.studentId, status: 'approved' } });
        let entry = await LeaderboardEntry.findOne({ where: { studentId: certificate.studentId } });
        if (entry) {
          await entry.update({ points: totalPoints });
        }
      }
      res.json(certificate);
      await AuditLog.create({
        timestamp: new Date(),
        actorId: req.body.actor_id,
        actorName: req.body.actor_name,
        action: `CERTIFICATE_${newStatus.toUpperCase()}`,
        targetType: 'certificate',
        targetId: req.params.id,
        details: JSON.stringify(req.body)
      });
    } catch (error) {
      next(error);
    }
  }
};
