// Test backend connection
async function testBackendConnection() {
    try {
        console.log('Testing backend connection...');
        
        const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method: 'email',
                contact: 'testuser@example.com'
            })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            console.log('✅ Backend connection successful!');
        } else {
            console.log('❌ Backend returned error:', data);
        }
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testBackendConnection();