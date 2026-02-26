// Test script to check API endpoint
const testEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'email',
        contact: 'test@example.com'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testEndpoint();