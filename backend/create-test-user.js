// Create test user for SMS testing
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        const hashedPassword = await bcrypt.hash('test123', 10);
        
        const user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                password: hashedPassword,
                phoneNumber: '+919876543210',
                role: 'user'
            }
        });
        
        console.log('✅ Test user created successfully!');
        console.log('📧 Email: testuser@example.com');
        console.log('📱 Phone: +919876543210');
        console.log('🔑 Password: test123');
        
    } catch (error) {
        if (error.code === 'P2002') {
            console.log('ℹ️  Test user already exists');
        } else {
            console.error('❌ Error creating test user:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();