// Test email token flow
async function testEmailTokenFlow() {
    try {
        console.log('Testing email token flow...\n');
        
        // First, get a reset token by requesting forgot password via email
        console.log('1. Getting reset token via email:');
        const forgotResponse = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'email',
                contact: 'testuser@example.com'
            })
        });
        
        const forgotData = await forgotResponse.json();
        console.log('Forgot password response:', forgotData);
        
        if (forgotData.success && forgotData.resetToken) {
            const resetToken = forgotData.resetToken;
            console.log(`\n2. Using reset token to reset password:`);
            
            const resetResponse = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: resetToken,
                    email: 'testuser@example.com',
                    newPassword: 'emailpassword123'
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
                        password: 'emailpassword123'
                    })
                });
                
                const loginData = await loginResponse.json();
                console.log('Login response:', loginData);
                
                if (loginData.success) {
                    console.log('\n✅ Email token flow works correctly!');
                    console.log('\n📧 Email reset link would be:');
                    console.log(`http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent('testuser@example.com')}`);
                }
            }
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testEmailTokenFlow();