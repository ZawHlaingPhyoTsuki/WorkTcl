import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { formSchema } from "@/lib/FormSchema";
import { prisma } from "@/lib/prisma";

// GET: Fetch all jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: {
          select: {
            name: true,
            email: true,
            phone: true,
            facebook: true,
            telegram: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST: Create a new job
export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Check if the user is authenticated
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await req.json();

    // Validate input with Zod
    const parsed = formSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Get the company associated with the current user
    const existingUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
      include: { company: true },
    });

    if (!existingUser || !existingUser.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Prepare the data for creating a new job
    const {
      title,
      description,
      type,
      location,
      facebookUrl,
      salaryMin,
      salaryMax,
    } = parsed.data;

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        type,
        location,
        facebookUrl,
        salaryMin: salaryMin ?? null, // Use null if undefined
        salaryMax: salaryMax ?? null, // Use null if undefined
        companyId: existingUser.company.id,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

