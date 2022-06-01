import { useState, useEffect } from "react";
import useScript from "react-script-hook";
import {
  GooglePickerDocument,
  OverridableTokenClientConfig,
  TokenClient,
  TokenClientConfig,
} from "../types";
import { EventEmitter } from "events";

let tokenClient: TokenClient;
let accessToken: string;
let scopes: string;
declare interface GoogleEvent {
  once(event: "GetAccessToken", listener: (accessToken: string) => void): this;
}
class GoogleEvent extends EventEmitter {
  GetAccessToken(accessToken: string): void {
    this.emit("GetAccessToken", accessToken);
  }
}
let googleEvent = new GoogleEvent();

const useTokenClient = (scope: string): [boolean, TokenClient] => {
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
        googleEvent.GetAccessToken(accessToken);
        console.log(response);
        console.log(`scope: ${scopes}`);
      },
    };
    tokenClient = window.google.accounts.oauth2.initTokenClient(config);
    setTokenClientInited(true);
  }, [gsi_loading, gsi_error]);

  return [tokenClientInited, tokenClient];
};

export const useGooglePicker = (): [
  boolean,
  (onPicked: (docs: GooglePickerDocument) => void) => void
] => {
  const [gapiClientInited, setgapiClientInited] = useState(false);
  const [pickerInited, setPickerInited] = useState(false);
  const [sheetInited, setSheetInited] = useState(false);
  const [pickerReady, setPickerReady] = useState(false);
  const [gapi_loading, gapi_error] = useScript({
    src: "https://apis.google.com/js/api.js",
  });
  const [tokenClientReady, tokenClient] = useTokenClient(
    "https://www.googleapis.com/auth/drive.readonly"
  );

  //handle gapi client with google picker
  useEffect(() => {
    if (gapi_loading) return;
    if (gapi_error !== null) console.log(gapi_error);

    window.gapi.load("client", () => setgapiClientInited(true));
  }, [gapi_loading, gapi_error]);

  useEffect(() => {
    if (gapiClientInited) {
      window.gapi.load("picker", () => {
        setPickerInited(true);
      });
      window.gapi.client
        .load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => {
          setSheetInited(true);
        });
    }
  }, [gapiClientInited]);

  useEffect(() => {
    if (tokenClientReady === true && pickerInited === true && sheetInited) {
      setPickerReady(true);
      console.log("google picker ready");
    }
  }, [tokenClientReady, pickerInited, sheetInited]);

  return [pickerReady, createPicker];
};

const createPicker = (onPicked: (docs: GooglePickerDocument) => void) => {
  const showPicker = () => {
    // TODO(developer): Replace with your API key
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.SPREADSHEETS)
      //   .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(accessToken)
      .setDeveloperKey("AIzaSyD_eeiV2S5CRcTR8oRAvTNoQvp9JzvI48w")
      .setCallback((data: any) => pickerCallback(data, onPicked))
      .build();
    picker.setVisible(true);
  };

  googleEvent.once("GetAccessToken", async (accessToken) => showPicker());

  const config: OverridableTokenClientConfig =
    scopes && scopes.includes("https://www.googleapis.com/auth/drive.readonly")
      ? {}
      : { scope: "https://www.googleapis.com/auth/drive.readonly" };
  tokenClient.requestAccessToken(config);
};

// A simple callback implementation.
function pickerCallback(
  data: any,
  onPicked: (doc: GooglePickerDocument) => void
) {
  if (
    data[window.google.picker.Response.ACTION] ==
    window.google.picker.Action.PICKED
  ) {
    let doc = data[window.google.picker.Response.DOCUMENTS][0];
    onPicked(doc);
  }
}

export const useGmail = (): [
  boolean,
  (mailOptions: MailOptions) => Promise<void>
] => {
  const [ready, setReady] = useState(false);
  const [tokenClientReady, tokenClient] = useTokenClient(
    "https://www.googleapis.com/auth/gmail.send"
  );

  useEffect(() => {
    if (tokenClientReady) setReady(true);
  }, [tokenClientReady]);

  return [ready, sendGmail];
};

const sendGmail = async (mailOptions: MailOptions) => {
  const config: OverridableTokenClientConfig =
    scopes && scopes.includes("https://www.googleapis.com/auth/gmail.send")
      ? {}
      : { scope: "https://www.googleapis.com/auth/gmail.send" };
  tokenClient.requestAccessToken(config);
  console.log("send gmail by backend");
  console.log(mailOptions);

  googleEvent.once("GetAccessToken", async (accessToken) => {
    console.log("get access token");
  });
};

export interface Address {
  name: string;
  address: string;
}

export interface MailOptions {
  /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
  from?: string | Address | undefined;
  /** An e-mail address that will appear on the Sender: field */
  sender?: string | Address | undefined;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to?: string | Address | Array<string | Address> | undefined;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
  cc?: string | Address | Array<string | Address> | undefined;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
  bcc?: string | Address | Array<string | Address> | undefined;
  /** An e-mail address that will appear on the Reply-To: field */
  replyTo?: string | Address | undefined;
  /** The message-id this message is replying */
  inReplyTo?: string | Address | undefined;
  /** Message-id list (an array or space separated string) */
  references?: string | string[] | undefined;
  /** The subject of the e-mail */
  subject?: string | undefined;
  /** The plaintext version of the message */
  text?: string | undefined;
  /** The HTML version of the message */
  html?: string | undefined;
  /** Apple Watch specific HTML version of the message, same usage as with text and html */
  watchHtml?: string | undefined;
  /** AMP4EMAIL specific HTML version of the message, same usage as with text and html. Make sure it is a full and valid AMP4EMAIL document, otherwise the displaying email client falls back to html and ignores the amp part */
  amp?: string | undefined;
  /** iCalendar event, same usage as with text and html. Event method attribute defaults to ‘PUBLISH’ or define it yourself: {method: 'REQUEST', content: iCalString}. This value is added as an additional alternative to html or text. Only utf-8 content is allowed */
  icalEvent?: string | undefined;
  /** An object or array of additional header fields */
  headers?: Headers | undefined;
  /** optional transfer encoding for the textual parts */
  encoding?: string | undefined;
  /** if set then overwrites entire message output with this value. The value is not parsed, so you should still set address headers or the envelope value for the message to work */
  raw?: string | undefined;
  /** if set to true then fails with an error when a node tries to load content from URL */
  disableUrlAccess?: boolean | undefined;
  /** if set to true then fails with an error when a node tries to load content from a file */
  disableFileAccess?: boolean | undefined;
}
