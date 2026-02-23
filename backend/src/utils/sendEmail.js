const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Common confirmation email
 * @param {string} to - receiver email
 * @param {string} name - person name
 * @param {string} role - Student | Tutor | HR
 * @param {string} password - auto generated password
 */
const sendConfirmationEmail = async ({ to, name, role, password }) => {
  await transporter.sendMail({
    from: `"Coaching Institute" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Coaching Institute 🎓",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hello ${name},</h2>

        <p>
          🎉 <b>Congratulations!</b> Your <b>${role}</b> account has been
          successfully created.
        </p>

        <p>You can now log in using the credentials below:</p>

        <div style="background:#f4f6f8; padding:12px; border-radius:6px">
          <p><b>Login ID (Email):</b> ${to}</p>
          <p><b>Password:</b> ${password}</p>
        </div>

        <p style="margin-top:10px;">
          🔐 For security reasons, please <b>change your password</b> after your
          first login.
        </p>

        <p>If you have any questions, feel free to contact us.</p>

        <br />
        <p>Regards,</p>
        <p><b>Coaching Institute Team</b></p>
      </div>
    `,
  });
};

module.exports = sendConfirmationEmail;
