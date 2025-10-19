const nodemailer = require("nodemailer");

const sendEmail = async (payload) => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL || user;

  if (!user || !pass || !to) {
    console.warn("Email configuration missing");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: user,
      replyTo: payload.email,
      to,
      subject: `Portfolio Contact: ${payload.subject}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\nMessage: ${payload.message}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message}</p>
      `,
    });

    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    return false;
  }
};

module.exports = { sendEmail };
