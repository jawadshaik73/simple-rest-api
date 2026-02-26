// Create test user for SMS testing
// Prisma client is installed in the backend directory
const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const bcrypt = require('./backend/node_modules/bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        const hashedPassword = await bcrypt.hash('test123', 10);

        // Use upsert to create or update the user
        // This handles the case where the user exists (email OTP works) 
        // but doesn't have a phoneNumber set
        const user = await prisma.user.upsert({
            where: { email: 'testuser@example.com' },
            update: {
                phoneNumber: '+919876543210',
            },
            create: {
                email: 'testuser@example.com',
                password: hashedPassword,
                phoneNumber: '+919876543210',
                role: 'user'
            }
        });

        console.log('✅ Test user created/updated successfully!');
        console.log('📧 Email:', user.email);
        console.log('📱 Phone:', user.phoneNumber);
        console.log('🔑 Password: test123');
        console.log('🆔 ID:', user.id);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('ℹ️  Phone number already in use by another user');
            console.log('   Trying to find the user with this phone...');
            const existing = await prisma.user.findUnique({ where: { phoneNumber: '+919876543210' } });
            if (existing) {
                console.log('📧 Found user with email:', existing.email);
            }
        } else {
            console.error('❌ Error creating test user:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();