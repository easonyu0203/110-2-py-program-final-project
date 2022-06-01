import { useState, useEffect } from "react";
import { useGooglePicker, useGmail, MailOptions } from "./hooks/useGoogleClient";
import { GooglePickerDocument, TokenClient, TokenClientConfig } from "./types";

type Props = {};

var google_client: TokenClient;

const App = (props: Props) => {
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

  const sendGmailWithData = () => {
    const options: MailOptions = {
      to: "b08705020@ntu.edu.tw",
      subject: "hello myself",
      text: "this is text area",
      html: "<h1>This is html area</h1>",
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
          <button onClick={() => sendGmailWithData()}>Send Email</button>
          ) : (
            <h1>Loading gmail</h1>
        )}
      </div>
    </>
  );
};

export default App;
