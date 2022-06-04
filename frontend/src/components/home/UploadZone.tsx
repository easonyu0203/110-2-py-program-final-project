import React, { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

type Props = {};

const UploadZone = (props: Props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const zoneRef = useRef()

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
        <div className="flex flex-col justify-center w-full h-full">
          <p className=" text-center text-slate-600">
            Drag 'n' drop some files here, or click to select files
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
