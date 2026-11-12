import React from "react";
import ReactDOM from "react-dom/client";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// Bootstrap JavaScript
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Our custom CSS
import "./index.css";

import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
