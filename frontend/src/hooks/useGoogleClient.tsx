import { useState, useEffect } from "react";
import useScript from "react-script-hook";
import {
  GooglePickerDocument,
  OverridableTokenClientConfig,
  TokenClient,
  TokenClientConfig,
} from "../type/googleTypes";
import { EventEmitter } from "events";

let tokenClient: TokenClient;
let accessToken: string;
let scopes: string;
export declare interface GoogleClientEvent {
  once(event: "GetAccessToken", listener: (accessToken: string) => void): this;
}
export class GoogleClientEvent extends EventEmitter {
  GetAccessToken(accessToken: string): void {
    this.emit("GetAccessToken", accessToken);
  }
}
let googleClientEvent = new GoogleClientEvent();
export const GetGoogleClientEvent = () => googleClientEvent;
export const GetTokenClient = () => tokenClient;
export const GetCurrentScope = () => scopes;

export const useTokenClient = (scope: string): [boolean, TokenClient] => {
  const [tokenClientInited, setTokenClientInited] = useState(false);

  // init token
  const [gsi_loading, gsi_error] = useScript({
    src: tokenClient ? "" : "https://accounts.google.com/gsi/client",
  });
  // handle gsi loaded
  useEffect(() => {
    if (gsi_error !== null) console.log(gsi_error);
    if (gsi_loading || tokenClientInited) return;
    if (tokenClient) {
      setTokenClientInited(true);
      return;
    }
    // init gsi client
    const config: TokenClientConfig = {
      client_id:
        "909450819951-jv8hmsp20g1mi7kql6s0qkquei2k4hvu.apps.googleusercontent.com",
      scope: scope,
      callback: async (response) => {
        if (response.error !== undefined) {
          throw response;
        }
        accessToken = response.access_token!;
        scopes = response.scope!;
        googleClientEvent.GetAccessToken(accessToken);
      },
    };
    tokenClient = window.google.accounts.oauth2.initTokenClient(config);
    setTokenClientInited(true);
  }, [gsi_loading, gsi_error]);

  return [tokenClientInited, tokenClient];
};

