const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Updating all profiles to be public...");
  const result = await prisma.translatorProfile.updateMany({
    data: {
      isPublic: true
    }
  });
  console.log(`Updated ${result.count} profiles.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
