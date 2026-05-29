import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import ScanProvider from "./context/ScanContext"

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <ScanProvider>
      <App />
    </ScanProvider>

  </React.StrictMode>

)