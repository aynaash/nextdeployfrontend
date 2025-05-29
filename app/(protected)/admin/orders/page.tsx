import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import {auth} from "../../../../a"
export const metadata = constructMetadata({
  title: "Orders – NextDeploy",
  description: "Check and manage your latest orders.",
});
// TODO: change this ui to fit for NextDeploy
export default async function OrdersPage() {
   const user = await getCurrentUser();
  console.log("The user at order admin page is:", user)
   if (!user || user.role !== "admin") redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Orders"
        text="Check and manage your latest orders."
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="package" />
        <EmptyPlaceholder.Title>No orders listed</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any orders yet. Start ordering a product.
        </EmptyPlaceholder.Description>
        <Button>Buy Products</Button>
      </EmptyPlaceholder>
    </>
  );
}
