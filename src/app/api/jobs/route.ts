import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { formSchema } from "@/lib/FormSchema";
import { prisma } from "@/lib/prisma";

// GET: Fetch jobs with pagination
export async function GET(req: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor"); // The cursor from client
    const limit = parseInt(searchParams.get("limit") || "10"); // Items per page

    const jobs = await prisma.job.findMany({
      take: limit + 1, // Get one extra to check if there's more
      ...(cursor && {
        // Only if cursor exists
        skip: 1, // Skip the cursor item itself
        cursor: {
          id: cursor, // Start after this ID
        },
      }),
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
        createdAt: "desc", // Newest first
      },
    });

    // Check if there's more data
    const hasNextPage = jobs.length > limit;
    // Remove the extra item if exists
    const items = hasNextPage ? jobs.slice(0, -1) : jobs;
    // Get the last item's ID as next cursor
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

    return NextResponse.json(
      {
        items, // The actual items for this page
        nextCursor, // Cursor for next page (null if no more)
        hasNextPage, // Boolean flag
      },
      { status: 200 }
    );
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
