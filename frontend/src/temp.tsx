import { useState, useEffect } from "react";
import { useGooglePicker } from "./hooks/useDrivePicker";
import { useGmail } from "./hooks/useGmail";
import { GooglePickerDocument, TokenClient, TokenClientConfig } from "./type/googleTypes";
import axios from "axios";
import { Backend_Url } from "./Config";
import { MailOptions } from "./type/BackendType";

let haveInit = false;
const initApp = () => {
  if (haveInit) return;
  console.log("init app");

  // axios
  axios.defaults.baseURL = Backend_Url;
  axios.defaults.headers.post["Content-Type"] = "application/json";

  haveInit = true;
};

const Temp = () => {
  useEffect(() => initApp(), []);

  const [pickerReady, createPicker] = useGooglePicker();
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const onPicked = async (doc: GooglePickerDocument) => {
    let docID: string = doc["id"];
    let response;
    response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: docID,
      includeGridData: true,
    });
    console.log(response);
    let data = response.result.sheets[0].data[0].rowData.map((d: any) =>
      d["values"].map((d: any) => d["formattedValue"])
    );
    console.log(data);
    setSheetData(data);
  };

  const [gmailReady, sendGmail] = useGmail();
  const [mailText, setMailText] = useState("");
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("");

  const sendGmailWithData = () => {
    const options: MailOptions = {
      to: mailTo,
      subject: mailSubject,
      text: mailText,
    };
    
    sendGmail(options);
  };

  return (
    <>
      {pickerReady ? (
        <button onClick={() => createPicker(onPicked)}>createPicker</button>
      ) : (
        <h1>loading picker</h1>
      )}
      <div>
        {sheetData.map((d, idx) => (
          <li key={idx}>{d.reduce((pre, cur) => `${pre} ${cur}`, "")}</li>
        ))}
      </div>

      <div>
        {gmailReady ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendGmailWithData();
              }}
            >
              To:
              <input
                className=" border-2 border-gray-800"
                type="text"
                value={mailTo}
                onChange={(e) => setMailTo(e.target.value)}
              />
              <br />
              Subject:
              <input
                className=" border-2 border-gray-800"
                type="text"
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
              />
              <br />
              Text:
              <br />
              <textarea
                className=" border-2 border-gray-800"
                value={mailText}
                onChange={(e) => setMailText(e.target.value)}
              />
              <br />
              <input
                className=" border-2 border-gray-800"
                type="submit"
                value="Send Email"
                style={{ cursor: "pointer" }}
              />
            </form>
          </>
        ) : (
          <h1>Loading gmail</h1>
        )}
      </div>
    </>
  );
};

export default Temp;
