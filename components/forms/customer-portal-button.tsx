'use client';

import { Button } from '@/components/ui/button';

interface CustomerPortalButtonProps {
  userStripeId: string;
}

export function CustomerPortalButton({ userStripeId }: CustomerPortalButtonProps) {
  // Temporary UI before Stripe customer portal integration
  return (
    <Button variant='outline' className='w-full cursor-not-allowed opacity-70' disabled>
      Customer portal coming soon
    </Button>
  );
}

/*
// Dynamic logic - commented out until billing is implemented

import { useTransition } from "react";
import { openCustomerPortal } from "@/actions/open-customer-portal";
import { Icons } from "@/components/shared/icons";

let [isPending, startTransition] = useTransition();
const generateUserStripeSession = openCustomerPortal.bind(null, userStripeId);

const stripeSessionAction = () =>
  startTransition(async () => await generateUserStripeSession());

return (
  <Button disabled={isPending} onClick={stripeSessionAction}>
    {isPending ? (
      <Icons.spinner className="mr-2 size-4 animate-spin" />
    ) : null}
    Open Customer Portal
  </Button>
);
*/
