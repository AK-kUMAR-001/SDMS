const { Certificate, User } = require('../../models/models/index.cjs');

// Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll({});
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error in getAllCertificates:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }],
    });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new certificate
exports.createCertificate = async (req, res) => {
  try {
    const { userId, courseName, issueDate, expirationDate } = req.body;
    const newCertificate = await Certificate.create({
      userId,
      courseName,
      issueDate,
      expirationDate,
    });
    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update certificate by ID
exports.updateCertificateById = async (req, res) => {
  try {
    const { courseName, issueDate, expirationDate } = req.body;
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    certificate.courseName = courseName || certificate.courseName;
    certificate.issueDate = issueDate || certificate.issueDate;
    certificate.expirationDate = expirationDate || certificate.expirationDate;
    await certificate.save();
    res.status(200).json({ message: 'Certificate updated successfully', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete certificate by ID
exports.deleteCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    await certificate.destroy();
    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
