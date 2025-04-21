import { UserProfileForm } from "@/components/general/settings/UserProfileForm";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    if (!dbUser) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">User not found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <UserProfileForm userId={dbUser.id}  />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading profile data</p>
      </div>
    );
  }
}
