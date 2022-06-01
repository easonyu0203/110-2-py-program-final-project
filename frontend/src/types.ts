declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export interface TokenClient {
  requestAccessToken(overrideConfig?: OverridableTokenClientConfig): void;
  callback?: (res: TokenResponse) => void;
}

export interface OverridableTokenClientConfig {
  scope?: string;
  prompt?: string;
}

export interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback?: (res: TokenResponse) => void;
}

export interface TokenResponse {
  access_token?: string;
  scope?: string;
  state?: string;
  error?: "access_denied";
}

export interface GooglePickerDocument{
    description: string;
    embedUrl: string,
    iconUrl: string,
    id: string,
    isShared: true
    lastEditedUtc: number,
    mimeType: string,
    name: string,
    serviceId: string,
    sizeBytes: number,
    type: string,
    url: string,
}

