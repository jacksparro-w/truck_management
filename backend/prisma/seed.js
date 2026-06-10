require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("../src/config/prisma");

const ADMIN_MOBILE = "9952577410";

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: {
      mobile: ADMIN_MOBILE,
    },
  });

  if (adminExists) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      name: "Brajin",
      mobile: ADMIN_MOBILE,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin user created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
