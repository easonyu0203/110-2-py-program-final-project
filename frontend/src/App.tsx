import React from "react";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import AppHome from "./components/home/AppHome";


import Temp from "./temp";

const App = () => {
  return (
    <>
      <div className="w-screen flex flex-col">
        <div className=" h-screen flex flex-col">
          <AppHeader />
          <AppHome />
        </div>
        <AppFooter />
        {/* <Temp/> */}
      </div>
    </>
  );
};

export default App;
