/**
 * Google Workspace SMTP Email Test
 * 
 * Tests sending email using Google Workspace SMTP
 */

import { loadEnv } from '../env/loader.js';
import { NodemailerAdapter } from '../src/infrastructure/adapters/email/NodemailerAdapter.js';

// Load environment
loadEnv();

async function testGoogleWorkspaceSMTP() {
    console.log('\n🧪 Testing Google Workspace SMTP...\n');

    const adapter = new NodemailerAdapter();

    // Test email
    const testEmail = {
        to: 'naseralghanim@outlook.com', // Your receiving email
        from: 'abobassam@k8u2r.com',
        subject: '✅ Oman Education AI - Google Workspace SMTP Test',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🎉 Google Workspace SMTP Integration Successful!</h1>
        <p>This is a test email from <strong>Oman Education AI System</strong></p>
        <p>Sent via <strong>Google Workspace SMTP</strong> (smtp.gmail.com)</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          From: abobassam@k8u2r.com<br>
          Sent at: ${new Date().toISOString()}<br>
          Environment: ${process.env.NODE_ENV || 'development'}
        </p>
      </div>
    `,
        text: 'Google Workspace SMTP Integration Successful! Sent from Oman Education AI System.',
    };

    try {
        console.log('📧 Sending test email...');
        console.log('   From:', testEmail.from);
        console.log('   To:', testEmail.to);
        console.log('   SMTP:', process.env.SMTP_HOST);

        const result = await adapter.sendEmail(testEmail);

        if (result.success) {
            console.log('\n✅ Email sent successfully via Google Workspace!');
            console.log('   Message ID:', result.messageId);
            console.log('\n💡 Check your inbox:', testEmail.to);
            console.log('\n🎯 Production email system is now active!');
        } else {
            console.error('\n❌ Email failed:', result.error);
        }
    } catch (error) {
        console.error('\n❌ Test failed:', error);
    }
}

testGoogleWorkspaceSMTP();
