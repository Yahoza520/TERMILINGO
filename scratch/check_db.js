const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { translatorProfile: true }
  });
  console.log("TOTAL USERS:", users.length);
  users.forEach(u => {
    console.log(`User: ${u.email}, Role: ${u.role}, Profile: ${u.translatorProfile ? 'EXISTS' : 'MISSING'}`);
    if (u.translatorProfile) {
      console.log(`  - isPublic: ${u.translatorProfile.isPublic}`);
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
