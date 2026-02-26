// Test SMS OTP
async function testSMSOTP() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({method: 'sms', contact: '+919876543210'})
        });
        
        const data = await response.json();
        console.log('SMS Response:', data);
        
        if (response.ok) {
            console.log('✅ SMS OTP sent successfully!');
        } else {
            console.log('❌ SMS OTP failed:', data);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSMSOTP();