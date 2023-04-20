import React from "react";
import Editor from "./components/Editor";
import Nav from "./components/Nav";
import SideBar from "./components/SideBar";
import "./index.css";

function App() {
  return (
    <div className="font-SpecialElite">
      <Nav />
      <div className="p-4 flex">
        <div className="flex-1">
          <Editor />
        </div>
        <SideBar />
      </div>
    </div>
  );
}

export default App;
