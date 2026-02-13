/**
 * SendGrid Email Test Script
 * 
 * Tests sending a verification email using SendGrid
 */

import { loadEnv } from '../env/loader.js';
import { SendGridAdapter } from '../src/infrastructure/adapters/email/SendGridAdapter.js';

// Load environment
loadEnv();

async function testSendGridEmail() {
    console.log('\n🧪 Testing SendGrid Email Service...\n');

    const adapter = new SendGridAdapter();

    // Test email
    const testEmail = {
        to: 'naseralghanim@outlook.com', // Replace with your email
        from: 'noreply@k8u2r.online',
        subject: '✅ Oman Education AI - SendGrid Test',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🎉 SendGrid Integration Successful!</h1>
        <p>This is a test email from <strong>Oman Education AI System</strong></p>
        <p>If you're reading this, your SendGrid integration is working perfectly!</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          Sent at: ${new Date().toISOString()}<br>
          Environment: ${process.env.NODE_ENV || 'development'}
        </p>
      </div>
    `,
        text: 'SendGrid Integration Successful! This is a test email from Oman Education AI System.',
    };

    try {
        console.log('📧 Sending test email to:', testEmail.to);
        const result = await adapter.sendEmail(testEmail);

        if (result.success) {
            console.log('✅ Email sent successfully!');
            console.log('   Message ID:', result.messageId);
            console.log('\n💡 Check your inbox:', testEmail.to);
        } else {
            console.error('❌ Email failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testSendGridEmail();
