import React from "react";
import ReactDOM from "react-dom";
import { TransactionProvider } from "./context/TransactionContext";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <TransactionProvider>
      <App />
    </TransactionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
