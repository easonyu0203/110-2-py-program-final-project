import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaGoogleDrive } from "react-icons/fa";
import { BiDevices } from "react-icons/bi";
import { useGooglePicker } from "../../hooks/useDrivePicker";
import { GooglePickerDocument } from "../../type/googleTypes";

const iconStyle =
  " text-xl border-2 rounded-full p-2 m-1 bg-slate-100 hover:bg-slate-300 hover:border-slate-800 transition";
const iconNotReadyStyle = "text-xl border-2 rounded-full  p-2 m-1 bg-slate-100 text-slate-400 transition";
const t = (
  <div className=" text-slate-300"></div>
);

type Props = {};

const SheetUploadZone = (props: Props) => {
  // sheet data
  const [sheetData, setSheetData] = useState<string[][]>([]);

  // drop zone
  const [dropEnable, setDropEnable] = useState(true);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: !dropEnable,
  });

  // google drive upload file
  const [pickerReady, createPicker] = useGooglePicker();
  const onPicked = async (doc: GooglePickerDocument) => {
    let docID: string = doc["id"];
    let response;
    response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: docID,
      includeGridData: true,
    });
    let data = response.result.sheets[0].data[0].rowData.map((d: any) =>
      d["values"].map((d: any) => d["formattedValue"])
    );
    console.log("get sheet data");
    console.log(data);
    setSheetData(data);
  };

  useEffect(() => {}, [acceptedFiles]);
  <div className=" w-full h-full rounded border-dashed border-2 border-slate-800 "></div>;

  return (
    <div className="bg-orange-200 rounded-xl w-full max-w-2xl h-full max-h-64 m-2 p-4">
      <div
        {...getRootProps({
          className:
            "bg-orange-300  w-full h-full rounded border-dashed border-2 border-slate-800 cursor-pointer",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col justify-center items-center w-full h-full">
          <p className="text-center text-slate-600">choose file from</p>
          <div className=" space-x-2 my-1">
            <button
              onMouseOver={() => setDropEnable(false)}
              onMouseLeave={() => setDropEnable(true)}
              onClick={() => createPicker(onPicked)}
              disabled={!pickerReady}
              className={pickerReady?iconStyle:iconNotReadyStyle}
            >
              <FaGoogleDrive />
            </button>
            <button
              className={iconStyle}
            >
              <BiDevices />
            </button>
          </div>
          <p className=" text-center text-sm text-slate-600">
            or drop file here
          </p>
        </div>
      </div>
    </div>
  );
};

export default SheetUploadZone;
