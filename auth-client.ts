import { createAuthClient } from 'better-auth/react';
import {
  organizationClient,
  passkeyClient,
  twoFactorClient,
  adminClient,
  multiSessionClient,
  oneTapClient,
  oidcClient,
  genericOAuthClient,
} from 'better-auth/client/plugins';
import { stripeClient } from '@better-auth/stripe/client';
import { toast } from 'sonner';

// Safely read Google One Tap Client ID
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! || '';
if (!googleClientId) {
  console.warn('⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
}

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/two-factor';
      },
    }),
    passkeyClient(),
    adminClient(),
    multiSessionClient(),
    oneTapClient({
      clientId: googleClientId ?? '',
      promptOptions: {
        maxAttempts: 1,
      },
    }),
    oidcClient(),
    genericOAuthClient(),
    stripeClient({
      subscription: true,
    }),
  ],
  fetchOptions: {
    onError(error: { error?: { status?: number; message?: string } }) {
      if (error?.error?.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error(error?.error?.message ?? 'Something went wrong.');
      }
    },
  },
});

// Destructured methods for usage in components
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
  useListOrganizations,
  useActiveOrganization,
  getSession,
} = authClient;

// Optional session change listener (useful for syncing global state)
authClient.$store.listen('$sessionSignal', async () => {
  // Optionally trigger data refresh here
  console.log('Session changed, you can refresh data here if needed');
});
