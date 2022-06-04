import React from "react";
import SheetUploadZone from "./SheetUploadZone";
import StepDesc from "./StepDesc";


type Props = {};


const AppHome = (props: Props) => {
  return (
    <div className=" w-full h-[92vh] flex-auto bg-slate-200 shadow-inner">
      <div
        id="work-space"
        className="p-6 h-3/5 pt-10 flex flex-col items-center"
      >
        <p
          id="descript-text"
          className=" font-mono text-base text-slate-600 text-center pt-6 pb-10"
        >
          easily send email to everyone using spreadsheat
        </p>
        <SheetUploadZone />
      </div>
      <div className=" w-full h-2/5 pt-2" id="instruct">
        <div className="h-full flex flex-col justify-center items-center">
          <h1 className="pt-4 text-xl font-semibold flex-initial">How to send email from spreadsheat</h1>
          <div className="w-full flex-auto flex justify-center items-start px-10 pt-2 space-x-8">
              <StepDesc stepNum={1}>upload the csv or spreadsheat you wish to send email</StepDesc>
              <StepDesc stepNum={2}>write the email using spreadsheat data</StepDesc>
              <StepDesc stepNum={3}>your email will be send to everyone in the spreadsheat</StepDesc>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHome;
