import { getCurrentUser } from '../../../../lib/session';
import { constructMetadata } from '../../../../lib/utils';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/header';
import { EmptyPlaceholder } from '@/components/shared/empty-placeholder';
import { redirect } from 'next/navigation';
import type { User } from '../../../../lib/types';

export const metadata = constructMetadata({
  title: 'Dashboard – NextDeploy',
  description: 'Create and manage content.',
});
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect('/login');

  return (
    <>
      <DashboardHeader
        heading='Dashboard'
        text={`Current Role: ${user?.role || 'user'} — Change your role in settings.`}
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name='post' />
        <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any content yet. Start creating content.
        </EmptyPlaceholder.Description>
        <Button>Add Content</Button>
      </EmptyPlaceholder>
    </>
  );
}
