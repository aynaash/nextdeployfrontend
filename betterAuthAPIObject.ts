const betterauth = 
Auth api looks like this: {
  signInSocial: [AsyncFunction (anonymous)] {
    path: '/sign-in/social',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  callbackOAuth: [AsyncFunction (anonymous)] {
    path: '/callback/:id',
    options: {
      method: [Array],
      body: [ZodOptional],
      query: [ZodOptional],
      metadata: [Object],
      use: [Array]
    }
  },
  getSession: [AsyncFunction (anonymous)] {
    path: '/get-session',
    options: {
      method: 'GET',
      query: [ZodOptional],
      requireHeaders: true,
      metadata: [Object],
      use: [Array]
    }
  },
  signOut: [AsyncFunction (anonymous)] {
    path: '/sign-out',
    options: {
      method: 'POST',
      requireHeaders: true,
      metadata: [Object],
      use: [Array]
    }
  },
  signUpEmail: [AsyncFunction (anonymous)] {
    path: '/sign-up/email',
    options: {
      method: 'POST',
      body: [ZodRecord],
      metadata: [Object],
      use: [Array]
    }
  },
  signInEmail: [AsyncFunction (anonymous)] {
    path: '/sign-in/email',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  forgetPassword: [AsyncFunction (anonymous)] {
    path: '/forget-password',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  resetPassword: [AsyncFunction (anonymous)] {
    path: '/reset-password',
    options: {
      method: 'POST',
      query: [ZodOptional],
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  verifyEmail: [AsyncFunction (anonymous)] {
    path: '/verify-email',
    options: {
      method: 'GET',
      query: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  sendVerificationEmail: [AsyncFunction (anonymous)] {
    path: '/send-verification-email',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  changeEmail: [AsyncFunction (anonymous)] {
    path: '/change-email',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  changePassword: [AsyncFunction (anonymous)] {
    path: '/change-password',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  setPassword: [AsyncFunction (anonymous)] {
    path: '/set-password',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  updateUser: [AsyncFunction (anonymous)] {
    path: '/update-user',
    options: {
      method: 'POST',
      body: [ZodRecord],
      use: [Array],
      metadata: [Object]
    }
  },
  deleteUser: [AsyncFunction (anonymous)] {
    path: '/delete-user',
    options: {
      method: 'POST',
      use: [Array],
      body: [ZodObject],
      metadata: [Object]
    }
  },
  forgetPasswordCallback: [AsyncFunction (anonymous)] {
    path: '/reset-password/:token',
    options: {
      method: 'GET',
      query: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  listSessions: [AsyncFunction (anonymous)] {
    path: '/list-sessions',
    options: {
      method: 'GET',
      use: [Array],
      requireHeaders: true,
      metadata: [Object]
    }
  },
  revokeSession: [AsyncFunction (anonymous)] {
    path: '/revoke-session',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      requireHeaders: true,
      metadata: [Object]
    }
  },
  revokeSessions: [AsyncFunction (anonymous)] {
    path: '/revoke-sessions',
    options: {
      method: 'POST',
      use: [Array],
      requireHeaders: true,
      metadata: [Object]
    }
  },
  revokeOtherSessions: [AsyncFunction (anonymous)] {
    path: '/revoke-other-sessions',
    options: {
      method: 'POST',
      requireHeaders: true,
      use: [Array],
      metadata: [Object]
    }
  },
  linkSocialAccount: [AsyncFunction (anonymous)] {
    path: '/link-social',
    options: {
      method: 'POST',
      requireHeaders: true,
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  listUserAccounts: [AsyncFunction (anonymous)] {
    path: '/list-accounts',
    options: { method: 'GET', use: [Array], metadata: [Object] }
  },
  deleteUserCallback: [AsyncFunction (anonymous)] {
    path: '/delete-user/callback',
    options: {
      method: 'GET',
      query: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  unlinkAccount: [AsyncFunction (anonymous)] {
    path: '/unlink-account',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  refreshToken: [AsyncFunction (anonymous)] {
    path: '/refresh-token',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  generateOpenAPISchema: [AsyncFunction (anonymous)] {
    path: '/open-api/generate-schema',
    options: { method: 'GET', use: [Array] }
  },
  openAPIReference: [AsyncFunction (anonymous)] {
    path: '/reference',
    options: { method: 'GET', metadata: [Object], use: [Array] }
  },
  generateTOTP: [AsyncFunction (anonymous)] {
    path: '/totp/generate',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  getTOTPURI: [AsyncFunction (anonymous)] {
    path: '/two-factor/get-totp-uri',
    options: {
      method: 'POST',
      use: [Array],
      body: [ZodObject],
      metadata: [Object]
    }
  },
  verifyTOTP: [AsyncFunction (anonymous)] {
    path: '/two-factor/verify-totp',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  sendTwoFactorOTP: [AsyncFunction (anonymous)] {
    path: '/two-factor/send-otp',
    options: {
      method: 'POST',
      body: [ZodOptional],
      metadata: [Object],
      use: [Array]
    }
  },
  verifyTwoFactorOTP: [AsyncFunction (anonymous)] {
    path: '/two-factor/verify-otp',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  verifyBackupCode: [AsyncFunction (anonymous)] {
    path: '/two-factor/verify-backup-code',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  generateBackupCodes: [AsyncFunction (anonymous)] {
    path: '/two-factor/generate-backup-codes',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  viewBackupCodes: [AsyncFunction (anonymous)] {
    path: '/two-factor/view-backup-codes',
    options: {
      method: 'GET',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  enableTwoFactor: [AsyncFunction (anonymous)] {
    path: '/two-factor/enable',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  disableTwoFactor: [AsyncFunction (anonymous)] {
    path: '/two-factor/disable',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  generatePasskeyRegistrationOptions: [AsyncFunction (anonymous)] {
    path: '/passkey/generate-register-options',
    options: {
      method: 'GET',
      use: [Array],
      query: [ZodOptional],
      metadata: [Object]
    }
  },
  generatePasskeyAuthenticationOptions: [AsyncFunction (anonymous)] {
    path: '/passkey/generate-authenticate-options',
    options: {
      method: 'POST',
      body: [ZodOptional],
      metadata: [Object],
      use: [Array]
    }
  },
  verifyPasskeyRegistration: [AsyncFunction (anonymous)] {
    path: '/passkey/verify-registration',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  verifyPasskeyAuthentication: [AsyncFunction (anonymous)] {
    path: '/passkey/verify-authentication',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  listPasskeys: [AsyncFunction (anonymous)] {
    path: '/passkey/list-user-passkeys',
    options: { method: 'GET', use: [Array], metadata: [Object] }
  },
  deletePasskey: [AsyncFunction (anonymous)] {
    path: '/passkey/delete-passkey',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  updatePasskey: [AsyncFunction (anonymous)] {
    path: '/passkey/update-passkey',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  createOrganization: [AsyncFunction (anonymous)] {
    path: '/organization/create',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  updateOrganization: [AsyncFunction (anonymous)] {
    path: '/organization/update',
    options: {
      method: 'POST',
      body: [ZodObject],
      requireHeaders: true,
      use: [Array],
      metadata: [Object]
    }
  },
  deleteOrganization: [AsyncFunction (anonymous)] {
    path: '/organization/delete',
    options: {
      method: 'POST',
      body: [ZodObject],
      requireHeaders: true,
      use: [Array],
      metadata: [Object]
    }
  },
  setActiveOrganization: [AsyncFunction (anonymous)] {
    path: '/organization/set-active',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  getFullOrganization: [AsyncFunction (anonymous)] {
    path: '/organization/get-full-organization',
    options: {
      method: 'GET',
      query: [ZodOptional],
      requireHeaders: true,
      use: [Array],
      metadata: [Object]
    }
  },
  listOrganizations: [AsyncFunction (anonymous)] {
    path: '/organization/list',
    options: { method: 'GET', use: [Array], metadata: [Object] }
  },
  createInvitation: [AsyncFunction (anonymous)] {
    path: '/organization/invite-member',
    options: {
      method: 'POST',
      use: [Array],
      body: [ZodObject],
      metadata: [Object]
    }
  },
  cancelInvitation: [AsyncFunction (anonymous)] {
    path: '/organization/cancel-invitation',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      openapi: [Object]
    }
  },
  acceptInvitation: [AsyncFunction (anonymous)] {
    path: '/organization/accept-invitation',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  getInvitation: [AsyncFunction (anonymous)] {
    path: '/organization/get-invitation',
    options: {
      method: 'GET',
      use: [Array],
      requireHeaders: true,
      query: [ZodObject],
      metadata: [Object]
    }
  },
  rejectInvitation: [AsyncFunction (anonymous)] {
    path: '/organization/reject-invitation',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  checkOrganizationSlug: [AsyncFunction (anonymous)] {
    path: '/organization/check-slug',
    options: { method: 'POST', body: [ZodObject], use: [Array] }
  },
  addMember: [AsyncFunction (anonymous)] {
    path: '/organization/add-member',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  removeMember: [AsyncFunction (anonymous)] {
    path: '/organization/remove-member',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  updateMemberRole: [AsyncFunction (anonymous)] {
    path: '/organization/update-member-role',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  getActiveMember: [AsyncFunction (anonymous)] {
    path: '/organization/get-active-member',
    options: { method: 'GET', use: [Array], metadata: [Object] }
  },
  leaveOrganization: [AsyncFunction (anonymous)] {
    path: '/organization/leave',
    options: { method: 'POST', body: [ZodObject], use: [Array] }
  },
  listInvitations: [AsyncFunction (anonymous)] {
    path: '/organization/list-invitations',
    options: { method: 'GET', use: [Array], query: [ZodOptional] }
  },
  hasPermission: [AsyncFunction (anonymous)] {
    path: '/organization/has-permission',
    options: {
      method: 'POST',
      requireHeaders: true,
      body: [ZodIntersection],
      use: [Array],
      metadata: [Object]
    }
  },
  setRole: [AsyncFunction (anonymous)] {
    path: '/admin/set-role',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  createUser: [AsyncFunction (anonymous)] {
    path: '/admin/create-user',
    options: {
      method: 'POST',
      body: [ZodObject],
      metadata: [Object],
      use: [Array]
    }
  },
  listUsers: [AsyncFunction (anonymous)] {
    path: '/admin/list-users',
    options: {
      method: 'GET',
      use: [Array],
      query: [ZodObject],
      metadata: [Object]
    }
  },
  listUserSessions: [AsyncFunction (anonymous)] {
    path: '/admin/list-user-sessions',
    options: {
      method: 'POST',
      use: [Array],
      body: [ZodObject],
      metadata: [Object]
    }
  },
  unbanUser: [AsyncFunction (anonymous)] {
    path: '/admin/unban-user',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  banUser: [AsyncFunction (anonymous)] {
    path: '/admin/ban-user',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  impersonateUser: [AsyncFunction (anonymous)] {
    path: '/admin/impersonate-user',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  stopImpersonating: [AsyncFunction (anonymous)] {
    path: '/admin/stop-impersonating',
    options: { method: 'POST', use: [Array] }
  },
  revokeUserSession: [AsyncFunction (anonymous)] {
    path: '/admin/revoke-user-session',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  revokeUserSessions: [AsyncFunction (anonymous)] {
    path: '/admin/revoke-user-sessions',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  removeUser: [AsyncFunction (anonymous)] {
    path: '/admin/remove-user',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  setUserPassword: [AsyncFunction (anonymous)] {
    path: '/admin/set-user-password',
    options: {
      method: 'POST',
      body: [ZodObject],
      use: [Array],
      metadata: [Object]
    }
  },
  userHasPermission: [AsyncFunction (anonymous)] {
    path: '/admin/has-permission',
    options: {
      method: 'POST',
      body: [ZodIntersection],
      metadata: [Object],
      use: [Array]
    }
  },
  listDeviceSessions: [AsyncFunction (anonymous)] {
    path: '/multi-session/list-device-sessions',
    options: { method: 'GET', requireHeaders: true, use: [Array] }
  },
  setActiveSession: [AsyncFunction (anonymous)] {
    path: '/multi-session/set-active',
    options: {
      method: 'POST',
      body: [ZodObject],
      requireHeaders: true,
      use: [Array],
      metadata: [Object]
    }
  },
  revokeDeviceSession: [AsyncFunction (anonymous)] {
    path: '/multi-session/revoke',
    options: {
      method: 'POST',
      body: [ZodObject],
      requireHeaders: true,
      use: [Array],
      metadata: [Object]
    }
  },
  stripeWebhook: [AsyncFunction (anonymous)] {
    path: '/stripe/webhook',
    options: {
      method: 'POST',
      metadata: [Object],
      cloneRequest: true,
      use: [Array]
    }
  },
  upgradeSubscription: [AsyncFunction (anonymous)] {
    path: '/subscription/upgrade',
    options: { method: 'POST', body: [ZodObject], use: [Array] }
  },
  cancelSubscriptionCallback: [AsyncFunction (anonymous)] {
    path: '/subscription/cancel/callback',
    options: { method: 'GET', query: [ZodOptional], use: [Array] }
  },
  cancelSubscription: [AsyncFunction (anonymous)] {
    path: '/subscription/cancel',
    options: { method: 'POST', body: [ZodObject], use: [Array] }
  },
  restoreSubscription: [AsyncFunction (anonymous)] {
    path: '/subscription/restore',
    options: { method: 'POST', body: [ZodObject], use: [Array] }
  },
  listActiveSubscriptions: [AsyncFunction (anonymous)] {
    path: '/subscription/list',
    options: { method: 'GET', query: [ZodOptional], use: [Array] }
  },
  subscriptionSuccess: [AsyncFunction (anonymous)] {
    path: '/subscription/success',
    options: { method: 'GET', query: [ZodOptional], use: [Array] }
  },
  ok: [AsyncFunction (anonymous)] {
    path: '/ok',
    options: { method: 'GET', metadata: [Object], use: [Array] }
  },
  error: [AsyncFunction (anonymous)] {
    path: '/error',
    options: { method: 'GET', metadata: [Object], use: [Array] }
  }
}

