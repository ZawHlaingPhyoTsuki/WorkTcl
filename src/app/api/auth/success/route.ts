import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Check if the user is authenticated
  if (!user || user == null || !user.id)
    throw new Error("Something went wrong with authentication: " + user);

  // Fetch the user from the database or create a new one
  let dbUser = await prisma.user.findUnique({
    where: { kindeId: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        kindeId: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage: user.picture ?? "",
      },
    });
  }

  // Get the base URL from the environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Determine redirect URL based on role
  const redirectUrl = dbUser.role === "ADMIN" ? `${baseUrl}/admin` : baseUrl;

  return NextResponse.redirect(redirectUrl);
}
