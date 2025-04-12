// app/api/users/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 400 }
    );
  }
}
