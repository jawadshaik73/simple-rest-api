// Test reset password functionality
async function testResetPassword() {
    try {
        console.log('Testing reset password flow...\n');
        
        // First, get a reset code by requesting forgot password
        console.log('1. Getting reset code via SMS:');
        const forgotResponse = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'sms',
                contact: '+911234567890'
            })
        });
        
        const forgotData = await forgotResponse.json();
        console.log('Forgot password response:', forgotData);
        
        if (forgotData.success && forgotData.resetCode) {
            const resetCode = forgotData.resetCode;
            console.log(`\n2. Using reset code ${resetCode} to reset password:`);
            
            const resetResponse = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: resetCode,
                    newPassword: 'newpassword123'
                })
            });
            
            const resetData = await resetResponse.json();
            console.log('Reset password response:', resetData);
            
            if (resetData.success) {
                console.log('\n3. Testing login with new password:');
                const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'testuser@example.com',
                        password: 'newpassword123'
                    })
                });
                
                const loginData = await loginResponse.json();
                console.log('Login response:', loginData);
            }
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testResetPassword();