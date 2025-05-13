import prisma from '../db/client';

async function main() {
  try {
    // Query all leads
    const leads = await prisma.lead.findMany();
    
    console.log('Found leads:', leads.length);
    console.log(JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error querying leads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 