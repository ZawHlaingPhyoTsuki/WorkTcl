// app/profile/page.tsx
import ProfileView from "@/components/general/profile/ProfileView";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return <div className="container mx-auto px-4 py-8">Unauthenticated</div>;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    if (!dbUser) {
      return <div className="container mx-auto px-4 py-8">User not found</div>;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <ProfileView userId={dbUser.id} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        Error loading profile data
      </div>
    );
  }
}
