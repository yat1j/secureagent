import { useContext } from "react"
import { ScanContext } from "../context/ScanContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
export default function Landing() {
    const [repoUrl, setRepoUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { setScanResult } = useContext(ScanContext)

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-12 py-6 border-b border-zinc-800">

        <h1 className="text-4xl font-bold text-cyan-400">
          SecureAgent
        </h1>

        <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl transition">
          Get Started
        </button>

      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32">

        <h1 className="text-7xl font-extrabold leading-tight max-w-6xl">
          Find out how a hacker would break your app.
        </h1>

        <p className="text-gray-400 text-2xl mt-8 max-w-4xl leading-relaxed">
          Paste a GitHub repository and get AI-powered security analysis,
          vulnerability reports, and fix suggestions instantly.
        </p>

        {/* INPUT */}
        <div className="flex gap-4 mt-14 w-full max-w-5xl">

         <input
          type="text"
         value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
         placeholder="Paste GitHub Repository URL..."
         className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-6 text-2xl outline-none focus:border-cyan-400"
         /> 

         <button
           onClick={async () => {

  setLoading(true)

  try {

    const response = await fetch("http://localhost:5000/scan", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        repoUrl: repoUrl
      })

    })

    const data = await response.json()
    setScanResult(data)

    console.log(data)

    setTimeout(() => {
      navigate("/dashboard")
    }, 2000)

  } catch (error) {

    console.log(error)

  }

}}

             className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-12 py-6 rounded-3xl text-2xl transition"
        >

      {loading ? "Scanning Repository..." : "Scan Repo"}

        </button>

        </div>

      </div>

    </div>
  )
}