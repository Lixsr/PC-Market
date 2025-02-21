import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();
  //   Delete all data from the database
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  //   Insert the sample data into the database
  await prisma.product.createMany({
    data: sampleData.products,
  });
  await prisma.user.createMany({
    data: sampleData.users,
  });
}
main()
  .then(() => console.log("Data was successfully seeded"))
  .catch((e) => {
    console.error(e);
    console.log("Data seeding failed. ", e);
  });
