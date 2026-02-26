// Test OTP delivery for both email and SMS
async function testOTP() {
    const API_URL = 'http://localhost:5000/api/v1';
    
    console.log('🧪 Testing OTP delivery...\n');
    
    // Test Email OTP
    console.log('📧 Testing Email OTP...');
    try {
        const emailResponse = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'email',
                contact: 'testuser@example.com'
            })
        });
        
        const emailData = await emailResponse.json();
        console.log('Email response:', emailData);
        
        if (emailResponse.ok) {
            console.log('✅ Email OTP request successful!');
            console.log('📧 Check the backend console for the email details');
        } else {
            console.log('❌ Email OTP failed:', emailData);
        }
    } catch (error) {
        console.error('❌ Email OTP error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test SMS OTP
    console.log('📱 Testing SMS OTP...');
    try {
        const smsResponse = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'sms',
                contact: '+919876543210'
            })
        });
        
        const smsData = await smsResponse.json();
        console.log('SMS response:', smsData);
        
        if (smsResponse.ok) {
            console.log('✅ SMS OTP request successful!');
            console.log('📱 Check the backend console for the SMS details');
        } else {
            console.log('❌ SMS OTP failed:', smsData);
        }
    } catch (error) {
        console.error('❌ SMS OTP error:', error.message);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📝 Check the backend terminal to see the actual OTPs being sent!');
}

testOTP();