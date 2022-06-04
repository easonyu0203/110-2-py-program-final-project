import { useEffect, useState } from "react";
import axios from "axios";

import { OverridableTokenClientConfig } from "../type/googleTypes";
import { GetCurrentScope, GetGoogleClientEvent, GetTokenClient, useTokenClient } from "./useGoogleClient";
import {MailOptions, SendEmailConfig, SendEmailResponse} from "../type/BackendType"

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
    GetCurrentScope() && GetCurrentScope().includes("https://www.googleapis.com/auth/gmail.send")
      ? {}
      : { scope: "https://www.googleapis.com/auth/gmail.send" };
  GetTokenClient().requestAccessToken(config);

  GetGoogleClientEvent().once("GetAccessToken", async (accessToken) => {
    const config: SendEmailConfig = {
      token: accessToken,
      mail: mailOptions 
    };
    const {data} = await axios.post("/test", config);
    const {success}: SendEmailResponse = data;
    console.log(`send email ${success}`);
    console.log(data);
    

  });
};
