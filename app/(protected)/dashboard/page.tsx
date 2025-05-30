import { getCurrentUser } from "../../../lib/session";
import { constructMetadata } from "../../../lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

// Define the User type
type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: string; // Make role optional since it might not exist in all user objects
};

export const metadata = constructMetadata({
  title: "Dashboard – NextDeploy",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = (await getCurrentUser()) as User | null;

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role: ${user?.role || 'user'} — Change your role in settings.`}
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any content yet. Start creating content.
        </EmptyPlaceholder.Description>
        <Button>Add Content</Button>
      </EmptyPlaceholder>
    </>
  );
}
