import RightContent from "@/components/general/home/RightContent";
import LeftContent from "@/components/general/home/LeftContent";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CenterContent from "@/components/general/home/CenterContent";

export default async function HomePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <main className="flex flex-col gap-4">
      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <LeftContent />

        {/* Center Content */}
        <CenterContent user={user} />

        {/* Right Sidebar */}
        <RightContent />
      </div>
    </main>
  );
}
