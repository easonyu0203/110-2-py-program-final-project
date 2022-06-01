import { useEffect, useState } from "react";
import useScript from "react-script-hook";
import { GooglePickerDocument, OverridableTokenClientConfig } from "../types";
import { GetCurrentScope, GetGoogleClientEvent, GetTokenClient, useTokenClient } from "./useGoogleClient";

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
  const showPicker = (accessToken: string) => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.SPREADSHEETS)
      //   .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(accessToken)
      .setDeveloperKey("AIzaSyD_eeiV2S5CRcTR8oRAvTNoQvp9JzvI48w")
      .setCallback((data: any) => pickerCallback(data, onPicked))
      .build();
    picker.setVisible(true);
  };

  GetGoogleClientEvent().once("GetAccessToken", async (accessToken) => showPicker(accessToken));

  const config: OverridableTokenClientConfig =
    GetCurrentScope() && GetCurrentScope().includes("https://www.googleapis.com/auth/drive.readonly")
      ? {}
      : { scope: "https://www.googleapis.com/auth/drive.readonly" };
  GetTokenClient().requestAccessToken(config);
};

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