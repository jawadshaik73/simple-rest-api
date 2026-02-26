// Check existing users
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, phoneNumber: true }
        });
        
        console.log('Existing users:');
        users.forEach(user => {
            console.log(`- ID: ${user.id}, Email: ${user.email}, Phone: ${user.phoneNumber}`);
        });
        
        if (users.length === 0) {
            console.log('No users found in database');
        }
        
    } catch (error) {
        console.error('❌ Error checking users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();