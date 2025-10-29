const nodemailer = require('nodemailer');

const sendTestEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // Replace with your SMTP host
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your_email@example.com', // Replace with your email
        pass: 'your_password' // Replace with your email password
      }
    });

    let info = await transporter.sendMail({
      from: '"Test User" <test@example.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: `<b>${text}</b>` // html body
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendTestEmail };