// Placeholder configuration per connector so that `requireConfig` passes in
// mock mode. None of these values is a real credential.
export const mockConfig: Record<string, Record<string, string>> = {
  awattar: { region: 'de' },
  tibber: { token: 'mock-token' },
  solcast: { apiKey: 'mock-key', resourceId: 'mock-site' },
  openweathermap: { apiKey: 'mock-key', lat: '52.52', lon: '13.40' },
  reonic: { apiKey: 'mock-key', clientId: 'mock-client' },
  ecoflow: { accessKey: 'mock-access', secretKey: 'mock-secret' },
  sevdesk: { apiKey: 'mock-key' },
  'google-calendar': { accessToken: 'mock-access-token', calendarId: 'primary' },
  gmail: { accessToken: 'mock-access-token' },
  'google-drive': { accessToken: 'mock-access-token' },
  whatsapp: { accessToken: 'mock-access-token', phoneNumberId: '100000000000000', wabaId: '200000000000000' },
};
