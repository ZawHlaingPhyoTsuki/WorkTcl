// app/api/users/[id]/social-links/route.ts
import { prisma } from "@/lib/prisma";
import { SocialLinkValues } from "@/lib/schemas/SocialLinkSchema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Type for the request body
interface UpdateSocialLinksRequest {
  socialLinks: SocialLinkValues[];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dbUserId = (await params).id;

    // Get the authenticated user
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    // Verify authentication
    if (!kindeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the database user
    const dbUser = await prisma.user.findUnique({
      where: { id: dbUserId },
      select: { kindeId: true },
    });

     if (!dbUser) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
     }

    // Verify the user is updating their own links
    if (dbUser.kindeId !== kindeUser.id ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Validate request body
    const requestBody: UpdateSocialLinksRequest = await request.json();
    if (!requestBody.socialLinks || !Array.isArray(requestBody.socialLinks)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // First delete all existing links
    await prisma.socialLink.deleteMany({
      where: { userId: dbUserId },
    });

    // Then create new ones in a transaction
    const createdLinks = await prisma.$transaction(
      requestBody.socialLinks.map((link) =>
        prisma.socialLink.create({
          data: {
            label: link.label,
            url: link.url,
            userId: dbUserId,
          },
        })
      )
    );

    return NextResponse.json(createdLinks);
  } catch (error) {
    console.error("Error updating social links:", error);

    // Type-safe error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to update social links", details: errorMessage },
      { status: 500 }
    );
  }
}
