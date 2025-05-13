import prisma from '../db/client';

async function main() {
  try {
    // Clear existing data
    await prisma.lead.deleteMany();
    
    // Create test lead
    const lead = await prisma.lead.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: ['DELIVERY', 'PAYMENT']
      },
    });
    
    console.log('Created test lead:', lead);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 