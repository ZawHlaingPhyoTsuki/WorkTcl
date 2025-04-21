// app/api/users/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { userUpdateSchema, UserWithRelations } from "@/lib/schemas/UserSchema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        socialLinks: true,
        jobs: {
          orderBy: { createdAt: "desc" },
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json<UserWithRelations>(user);
  } catch (error) {
    console.log("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  try {
    const id = (await params).id;
    const body = await request.json();

    // Validate input
    const validation = userUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Authorization check
    if (
      existingUser.kindeId !== kindeUser.id &&
      existingUser.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent role/plan updates for non-admin users
    const updateData = { ...validation.data };
    if (existingUser.role !== "ADMIN") {
      delete updateData.role;
      delete updateData.plan;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        socialLinks: true,
        jobs: true,
      },
    });

    return NextResponse.json<UserWithRelations>(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
