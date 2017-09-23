import React from "react";
import ReactDOM from "react-dom";
import App from "./view/App.js";

function initializeApp() {
  let root = document.createElement("div");
  root.id = "root";
  root.style.height = "100%";
  document.body.appendChild(root);

  ReactDOM.render(<App />, root);
}

initializeApp();
