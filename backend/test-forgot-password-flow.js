// Test forgot password flow
async function testForgotPassword() {
    try {
        console.log('Testing forgot password flow...\n');
        
        // Test 1: Email reset
        console.log('1. Testing email reset:');
        const emailResponse = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
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
        
        // Test 2: SMS reset
        console.log('\n2. Testing SMS reset:');
        const smsResponse = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'sms',
                contact: '+911234567890'
            })
        });
        
        const smsData = await smsResponse.json();
        console.log('SMS response:', smsData);
        
        // Test 3: Non-existent user (should return 404)
        console.log('\n3. Testing non-existent user:');
        const notFoundResponse = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'email',
                contact: 'nonexistent@example.com'
            })
        });
        
        const notFoundData = await notFoundResponse.json();
        console.log('Non-existent user response:', notFoundData);
        console.log('Status:', notFoundResponse.status);
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testForgotPassword();