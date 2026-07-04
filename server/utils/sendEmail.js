const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Use regex to find the 6-digit OTP code hidden in your text
        const otpMatch = text.match(/\b\d{6}\b/);
        const otpCode = otpMatch ? otpMatch[0] : "ERROR";

        // HTML Email Template
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                .header { background-color: #2563eb; padding: 30px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; }
                .content { padding: 40px 30px; text-align: center; }
                .content p { color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; }
                .otp-box { background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 30px 0; font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: 8px; }
                .footer { padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
                .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Your Workspace</h1>
                </div>
                <div class="content">
                    <p>Secure Verification Required</p>
                    <p>Please use the following 6-digit code to complete your request. This code will expire in 5 minutes.</p>
                    
                    <div class="otp-box">
                        ${otpCode}
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b;">If you did not request this code, please safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await transporter.sendMail({
            from: `"Workspace Security" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text, // Fallback for email clients that don't support HTML
            html: htmlTemplate // The premium visual version
        });

        return true;
    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }
};

module.exports = sendEmail;