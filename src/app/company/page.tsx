import { prisma } from "@/lib/prisma";
import CompanyForm from "@/components/general/(form)/CompanyForm";
import CompanyDetails from "@/components/general/CompanyDetails";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function CompanyPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return <div className="container mx-auto px-4 py-8">Unauthenticated</div>;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
      include: { company: true },
    });

    if (!dbUser) {
      return <div className="container mx-auto px-4 py-8">User not found</div>;
    }

    if (!dbUser.company) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <p>No company found for this user</p>
            </div>
            <div className="w-full lg:w-1/2">
              <CompanyForm />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <CompanyDetails companyId={dbUser.company.id} />
          </div>
          <div className="w-full lg:w-1/2">
            <CompanyForm />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user or company:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        Error loading company data
      </div>
    );
  }
}
