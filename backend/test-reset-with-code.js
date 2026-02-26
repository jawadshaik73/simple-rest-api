// Test reset password with the code we got
async function testResetWithCode() {
    try {
        console.log('Testing reset password with code 771658...\n');
        
        const resetResponse = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: '771658',
                newPassword: 'newpassword123'
            })
        });
        
        const resetData = await resetResponse.json();
        console.log('Reset password response:', resetData);
        
        if (resetData.success) {
            console.log('\nTesting login with new password:');
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
            
            if (loginData.success) {
                console.log('\n✅ Success! Password reset and login work correctly.');
            }
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testResetWithCode();