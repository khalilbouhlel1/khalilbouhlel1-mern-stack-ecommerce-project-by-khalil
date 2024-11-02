import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendNewsletter = async (subscribers, subject, content) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: subscribers, // Use BCC for privacy
      subject: subject,
      html: content
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Newsletter sending error:', error);
    throw error;
  }
}; 