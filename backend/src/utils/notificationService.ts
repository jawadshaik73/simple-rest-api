export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export interface SMSOptions {
    to: string;
    message: string;
}

export class NotificationService {
    /**
     * Send email notification
     * In production, this would integrate with services like SendGrid, AWS SES, etc.
     */
    static async sendEmail(options: EmailOptions): Promise<void> {
        // For development/testing: log to console
        console.log('📧 EMAIL SENT:');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Content: ${options.text || options.html}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // In production, you would use:
        // const nodemailer = require('nodemailer');
        // const transporter = nodemailer.createTransport({...});
        // await transporter.sendMail({...});
    }

    /**
     * Send SMS notification
     * In production, this would integrate with services like Twilio, AWS SNS, etc.
     */
    static async sendSMS(options: SMSOptions): Promise<void> {
        // For development/testing: log to console
        console.log('📱 SMS SENT:');
        console.log(`To: ${options.to}`);
        console.log(`Message: ${options.message}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // In production, you would use:
        // const twilio = require('twilio');
        // const client = twilio(accountSid, authToken);
        // await client.messages.create({...});
    }

    /**
     * Send password reset email
     */
    static async sendPasswordResetEmail(email: string, resetLink: string, resetCode: string): Promise<void> {
        const subject = 'Password Reset Request';
        const text = `
            You requested a password reset.
            
            Reset Link: ${resetLink}
            Reset Code: ${resetCode}
            
            This code expires in 10 minutes.
            If you didn't request this, please ignore this email.
        `;
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Password Reset Request</h2>
                <p>You requested a password reset.</p>
                <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Reset Link:</strong> <a href="${resetLink}" style="color: #4F46E5;">${resetLink}</a></p>
                    <p><strong>Reset Code:</strong> <code style="background-color: #E5E7EB; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${resetCode}</code></p>
                </div>
                <p style="color: #6B7280; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `;

        await this.sendEmail({
            to: email,
            subject,
            text,
            html
        });
    }

    /**
     * Send password reset SMS
     */
    static async sendPasswordResetSMS(phoneNumber: string, resetCode: string): Promise<void> {
        const message = `Your password reset code is: ${resetCode}. Valid for 10 minutes. If you didn't request this, please ignore.`;
        
        await this.sendSMS({
            to: phoneNumber,
            message
        });
    }
}