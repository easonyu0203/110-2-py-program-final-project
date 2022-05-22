import { useState, useEffect } from "react";
import useGooglePicker from "./hooks/useGoogleClient";
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
      "spreadsheetId": docID,
      "includeGridData": true,
    });
    console.log(response);
    let data = response.result.sheets[0].data[0].rowData.map((d:any)=>d["values"].map((d:any)=>d["formattedValue"]))
    console.log(data);
    setSheetData(data);
  };


  return (
    <>
      {pickerReady ? (
        <button onClick={() => createPicker(onPicked)}>createPicker</button>
      ) : (
        <h1>loading picker</h1>
      )}
      <div>
        {sheetData.map((d, idx)=><li key={idx}>{d.reduce((pre, cur)=>`${pre} ${cur}`, "")}</li>)}
      </div>
    </>
  );
};

export default App;
