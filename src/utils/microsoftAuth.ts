export const MICROSOFT_SCOPES = 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read';

export const getMicrosoftAuthConfig = (redirectUrl: string) => ({
  provider: 'azure' as const,
  options: {
    scopes: MICROSOFT_SCOPES,
    redirectTo: redirectUrl,
    queryParams: {
      prompt: 'consent'
    }
  }
});