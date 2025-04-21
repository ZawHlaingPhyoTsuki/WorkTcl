import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { jobSchema, JobTypeEnum, JobTypesEnum } from "@/lib/schemas/JobSchema";
import { createJobWithLinks } from "@/lib/utils/job-helpers";

// GET: Fetch jobs with pagination and filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const typeParam = searchParams.get("type") || undefined;
    const categoryParam = searchParams.get("category");

    // Validate job type
    let type: JobTypesEnum | undefined;
    if (typeParam) {
      const result = JobTypeEnum.safeParse(typeParam);
      if (result.success) {
        type = result.data;
      } else {
        return NextResponse.json(
          { error: "Invalid job type", validTypes: JobTypeEnum.options },
          { status: 400 }
        );
      }
    }

    // Start query timing
    console.time("job-query");

    const jobs = await prisma.job.findMany({
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      where: {
        isActive: true,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(type && { type }),
        ...(categoryParam && { category: categoryParam }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            phone: true,
            socialLinks: true,
            role: true,
          },
        },
        links: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.timeEnd("job-query");

    const hasNextPage = jobs.length > limit;
    const items = hasNextPage ? jobs.slice(0, -1) : jobs;
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

    return NextResponse.json(
      { items, nextCursor, hasNextPage },
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
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validate request
    const body = await req.json();
    const validation = jobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Get or validate user
    const existingUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Process job creation
    const result = await createJobWithLinks(existingUser.id, validation.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
