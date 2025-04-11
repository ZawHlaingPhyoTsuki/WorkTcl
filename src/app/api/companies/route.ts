import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/lib/CompanySchema";

// GET: Fetch all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        facebook: true,
        telegram: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

// POST: Create a new company
export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser || !kindeUser.id || !kindeUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { kindeId: kindeUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent users from creating multiple companies
    const existingCompany = await prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already exists for this user" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = companySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newCompany = await prisma.company.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (err) {
    console.error("Company creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

