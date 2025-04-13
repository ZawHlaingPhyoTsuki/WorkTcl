import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobType } from "@prisma/client"; // Import Prisma-generated enum for job types
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { jobSchema } from "@/lib/schemas/JobSchema";

// GET: Fetch jobs with pagination and filtering
export async function GET(req: Request) {
  try {
    // Extract query parameters from URL
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor"); // Used for pagination - ID of the last item from previous page
    const limit = parseInt(searchParams.get("limit") || "10"); // Number of items per page (default 10)
    const search = searchParams.get("search") || undefined; // Optional search term
    const typeParam = searchParams.get("type") || undefined; // Optional job type filter

    // Validate and convert the type parameter to JobType enum
    let type: JobType | undefined;
    if (typeParam) {
      // Ensure the provided type matches one of our enum values
      if (Object.values(JobType).includes(typeParam as JobType)) {
        type = typeParam as JobType; // Cast to enum type if valid
      } else {
        return NextResponse.json(
          { error: "Invalid job type" },
          { status: 400 } // Bad request if invalid type
        );
      }
    }

    // Fetch jobs from database with pagination and filters
    const jobs = await prisma.job.findMany({
      take: limit + 1, // Fetch one extra item to check if more pages exist
      ...(cursor && {
        // Only apply cursor if it exists
        skip: 1, // Skip the cursor item itself
        cursor: {
          id: cursor, // Start after this ID
        },
      }),
      where: {
        ...(search && {
          // Only apply search filter if search term exists
          OR: [
            // Search across multiple fields
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(type && { type }), // Filter by job type if specified
        isActive: true, // Only show active jobs
      },
      include: {
        // Include related user data
        user: {
          select: {
            // Only select specific user fields
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            phone: true,
            facebookUrl: true,
            telegramUrl: true,
          },
        },
      },
      orderBy: {
        // Sort by creation date (newest first)
        createdAt: "desc",
      },
    });

    // Determine if there are more pages of data
    const hasNextPage = jobs.length > limit;
    // Remove the extra item if we fetched it
    const items = hasNextPage ? jobs.slice(0, -1) : jobs;
    // Get the last item's ID for next page cursor
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

    // Return paginated results
    return NextResponse.json(
      {
        items, // Array of job objects for current page
        nextCursor, // ID to use for next page (null if no more pages)
        hasNextPage, // Boolean indicating if more pages exist
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

// POST: Create a new job listing
  export async function POST(req: Request) {
  // Get current user session
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Reject unauthorized requests
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = jobSchema.safeParse(body); // Validate against Zod schema

    // Return validation errors if any
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.flatten(), // Detailed validation errors
        },
        { status: 400 } // Bad request status
      );
    }

    // Find the user in our database
    const existingUser = await prisma.user.findUnique({
      where: { kindeId: user.id }, // Find by Kinde auth ID
    });

    // Reject if user doesn't exist in our DB
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract validated data
    const {
      title,
      description,
      type,
      location,
      facebookUrl,
      salaryMin,
      salaryMax,
      category,
    } = parsed.data;

    // Create new job in database
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        type,
        location,
        // Use provided URL or fall back to user's profile URL
        facebookUrl: facebookUrl || existingUser.facebookUrl || "",
        // Handle optional salary fields (convert undefined to null)
        salaryMin: salaryMin ?? null,
        salaryMax: salaryMax ?? null,
        // Optional category
        category: category || null,
        // Associate with user
        userId: existingUser.id,
      },
    });

    // Return created job with 201 status
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
