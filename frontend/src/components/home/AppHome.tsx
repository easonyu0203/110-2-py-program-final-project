import React from "react";
import UploadZone from "./UploadZone";


type Props = {};

const AppHome = (props: Props) => {
  return (
    <div className=" w-full flex-auto bg-slate-200">
      <div
        id="work-space"
        className="m-6 h-3/5 pt-10 flex flex-col items-center"
      >
        <p
          id="descript-text"
          className=" font-mono text-base text-slate-600 text-center pt-6 pb-10"
        >
          easily send email to everyone using spreadsheat
        </p>
        <UploadZone />
      </div>
      <div className=" w-full h-2/5" id="instruct">
        instruction step 1 2 3
      </div>
    </div>
  );
};

export default AppHome;
