import { createContext, useState } from "react"

export const ScanContext = createContext()

export default function ScanProvider({ children }) {

  const [scanResult, setScanResult] = useState(null)

  return (
    <ScanContext.Provider value={{
      scanResult,
      setScanResult
    }}>
      {children}
    </ScanContext.Provider>
  )
}