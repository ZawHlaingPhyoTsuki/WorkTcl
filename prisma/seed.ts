import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { JobType, Plan, Role } from "@prisma/client";

async function main() {
  console.log("🌱 Resetting database...");
  await prisma.jobLink.deleteMany();
  await prisma.job.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Starting seed...");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        kindeId: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profileImage: faker.image.avatar(),
        phone: faker.phone.number(),
        role: Role.ADMIN,
        plan: Plan.PRO,
        socialLinks: {
          create: [
            { label: "LinkedIn", url: faker.internet.url() },
            { label: "Portfolio", url: faker.internet.url() },
          ],
        },
      },
    }),
    prisma.user.create({
      data: {
        kindeId: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profileImage: faker.image.avatar(),
        phone: faker.phone.number(),
        role: Role.USER,
        plan: Plan.FREE,
        socialLinks: {
          create: [{ label: "Twitter", url: faker.internet.url() }],
        },
      },
    }),
  ]);


  const jobTitles = [
    "Frontend Developer",
    "Backend Engineer",
    "Fullstack Developer",
    "UI/UX Designer",
    "Product Manager",
    "DevOps Engineer",
    "Data Analyst",
    "Marketing Specialist",
    "QA Engineer",
    "Technical Writer",
    "iOS Developer",
    "Android Developer",
    "Customer Success Manager",
    "Recruiter",
    "Business Analyst",
    "Project Manager",
    "Security Engineer",
    "Cloud Architect",
    "Sales Engineer",
    "Content Strategist",
  ];

  const jobTypes = Object.values(JobType);
  const socialLabels = [
    "LinkedIn",
    "Twitter",
    "Instagram",
    "Portfolio",
    "YouTube",
  ];

  for (let i = 0; i < jobTitles.length; i++) {
    const user = users[i % users.length];
    const jobType = jobTypes[i % jobTypes.length];

    // Generate 1-3 fake social links
    const numberOfLinks = faker.number.int({ min: 1, max: 3 });
    const shuffledLabels = faker.helpers.shuffle(socialLabels);
    const jobLinks = Array.from({ length: numberOfLinks }).map((_, index) => ({
      label: shuffledLabels[index],
      url: faker.internet.url(),
    }));

    await prisma.job.create({
      data: {
        title: jobTitles[i],
        description: faker.lorem.paragraph(),
        location: faker.location.city(),
        type: jobType,
        salaryMin: faker.number.int({ min: 40000, max: 60000 }),
        salaryMax: faker.number.int({ min: 70000, max: 100000 }),
        userId: user.id,
        category: faker.commerce.department(),
        isActive: true,
        links: {
          create: jobLinks,
        },
      },
    });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
