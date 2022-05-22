import { useState, useEffect } from "react";
import useScript from "react-script-hook";
import { GooglePickerDocument, TokenClient, TokenClientConfig } from "../types";
import { EventEmitter } from "events";

let tokenClient: TokenClient;
let accessToken: string;
declare interface GoogleEvent {
  once(event: "GetAccessToken", listener: (accessToken: string) => void): this;
}
class GoogleEvent extends EventEmitter {
  GetAccessToken(accessToken: string): void {
    this.emit("GetAccessToken", accessToken);
  }
}
let googleEvent = new GoogleEvent();

const useTokenClient = (): [boolean, TokenClient] => {
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
      scope: "https://www.googleapis.com/auth/drive.readonly",
      callback: async (response) => {
        if (response.error !== undefined) {
          throw response;
        }
        accessToken = response.access_token!;
        googleEvent.GetAccessToken(accessToken);
      },
    };
    tokenClient = window.google.accounts.oauth2.initTokenClient(config);
    setTokenClientInited(true);
    console.log("google token client init");
  }, [gsi_loading, gsi_error]);

  return [tokenClientInited, tokenClient];
};

const useGooglePicker = (): [boolean, (onPicked:(docs: GooglePickerDocument)=>void)=>void] => {
    const [gapiClientInited, setgapiClientInited] = useState(false);
  const [pickerInited, setPickerInited] = useState(false);
  const [sheetInited, setSheetInited] = useState(false);
  const [pickerReady, setPickerReady] = useState(false);
  const [gapi_loading, gapi_error] = useScript({
    src: "https://apis.google.com/js/api.js",
  });
  const [tokenClientReady, tokenClient] = useTokenClient();

  //handle gapi client with google picker
  useEffect(() => {
    if (gapi_loading) return;
    if (gapi_error !== null) console.log(gapi_error);

    window.gapi.load("client", () => setgapiClientInited(true));
  }, [gapi_loading, gapi_error]);

  useEffect(() => {
    if(gapiClientInited){
        window.gapi.load("picker", ()=>{
            setPickerInited(true);
        })
        window.gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4").then(
            ()=>{
                setSheetInited(true);
            }
        )
    }
  }, [gapiClientInited])
  

  useEffect(() => {
    if (tokenClientReady === true && pickerInited === true && sheetInited) {
      setPickerReady(true);
      console.log("google picker ready");
    }
  }, [tokenClientReady, pickerInited, sheetInited]);

  return [pickerReady, createPicker];
};

const createPicker = (onPicked: (docs: GooglePickerDocument)=>void) => {
  const showPicker = () => {
    // TODO(developer): Replace with your API key
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.SPREADSHEETS)
      //   .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(accessToken)
      .setDeveloperKey("AIzaSyD_eeiV2S5CRcTR8oRAvTNoQvp9JzvI48w")
      .setCallback((data:any)=>pickerCallback(data, onPicked))
      .build();
    picker.setVisible(true);
  };

  googleEvent.once("GetAccessToken", async (accessToken) => showPicker());

  if (accessToken === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
};

// A simple callback implementation.
function pickerCallback(data: any, onPicked: (doc: GooglePickerDocument)=>void) {
  if (
    data[window.google.picker.Response.ACTION] ==
    window.google.picker.Action.PICKED
  ) {
      let doc = data[window.google.picker.Response.DOCUMENTS][0];
      onPicked(doc);
  }
}

export default useGooglePicker;
