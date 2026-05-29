import generatePDF from "../utils/generatePDF"
import { useContext } from "react"
import { ScanContext } from "../context/ScanContext"

import Sidebar from "../components/dashboard/Sidebar"
import SecurityChart from "../components/dashboard/SecurityChart"

import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Bug
} from "lucide-react"

export default function Dashboard() {

  const { scanResult } = useContext(ScanContext)

  // SHARE FUNCTION
  const handleShare = async () => {

    await navigator.clipboard.writeText(
      window.location.href
    )

    alert("Link copied!")
  }

  return (

    <div className="flex bg-black text-white">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 min-h-screen">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold text-cyan-400">
              Security Dashboard
            </h1>

            <p className="text-gray-400 mt-3">
              AI-powered repository vulnerability analysis
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() => generatePDF(scanResult)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-2xl"
            >
              Export Report
            </button>

            <button
              onClick={handleShare}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-2xl"
            >
              Share Report
            </button>

          </div>

        </div>

        {/* REPOSITORY INFO */}
        <div className="grid md:grid-cols-5 gap-6 mb-10">

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">

            <p className="text-gray-400">
              Repository
            </p>

            <h2 className="text-xl font-bold text-cyan-400 mt-2">
              {scanResult?.repo?.name || "N/A"}
            </h2>

          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">

            <p className="text-gray-400">
              Stars
            </p>

            <h2 className="text-xl font-bold text-yellow-400 mt-2">
              {scanResult?.repo?.stars || 0}
            </h2>

          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">

            <p className="text-gray-400">
              Forks
            </p>

            <h2 className="text-xl font-bold text-cyan-400 mt-2">
              {scanResult?.repo?.forks || 0}
            </h2>

          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">

            <p className="text-gray-400">
              Issues
            </p>

            <h2 className="text-xl font-bold text-red-400 mt-2">
              {scanResult?.repo?.issues || 0}
            </h2>

          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">

            <p className="text-gray-400">
              Language
            </p>

            <h2 className="text-xl font-bold text-green-400 mt-2">
              {scanResult?.repo?.language || "Unknown"}
            </h2>

          </div>

        </div>

        {/* TOP STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          {/* CARD 1 */}
          <div
            className="
            bg-gradient-to-br
            from-zinc-900
            to-zinc-950
            rounded-3xl
            p-6
            border
            border-zinc-800
            hover:border-red-500
            transition-all
            duration-300
            hover:scale-105
          "
          >

            <div className="flex items-center justify-between">

              <p className="text-gray-400">
                Security Score
              </p>

              <ShieldAlert
                className="text-red-400"
                size={28}
              />

            </div>

            <h2 className="text-5xl font-bold text-red-500 mt-5">
              42%
            </h2>

          </div>

          {/* CARD 2 */}
          <div
            className="
            bg-gradient-to-br
            from-zinc-900
            to-zinc-950
            rounded-3xl
            p-6
            border
            border-zinc-800
            hover:border-red-500
            transition-all
            duration-300
            hover:scale-105
          "
          >

            <div className="flex items-center justify-between">

              <p className="text-gray-400">
                Critical Issues
              </p>

              <Bug
                className="text-red-400"
                size={28}
              />

            </div>

            <h2 className="text-5xl font-bold text-red-400 mt-5">
              7
            </h2>

          </div>

          {/* CARD 3 */}
          <div
            className="
            bg-gradient-to-br
            from-zinc-900
            to-zinc-950
            rounded-3xl
            p-6
            border
            border-zinc-800
            hover:border-yellow-500
            transition-all
            duration-300
            hover:scale-105
          "
          >

            <div className="flex items-center justify-between">

              <p className="text-gray-400">
                Medium Issues
              </p>

              <AlertTriangle
                className="text-yellow-400"
                size={28}
              />

            </div>

            <h2 className="text-5xl font-bold text-yellow-400 mt-5">
              12
            </h2>

          </div>

          {/* CARD 4 */}
          <div
            className="
            bg-gradient-to-br
            from-zinc-900
            to-zinc-950
            rounded-3xl
            p-6
            border
            border-zinc-800
            hover:border-green-500
            transition-all
            duration-300
            hover:scale-105
          "
          >

            <div className="flex items-center justify-between">

              <p className="text-gray-400">
                Safe Files
              </p>

              <CheckCircle
                className="text-green-400"
                size={28}
              />

            </div>

            <h2 className="text-5xl font-bold text-green-400 mt-5">
              84
            </h2>

          </div>

        </div>

        {/* VULNERABILITY REPORTS */}
        <div className="grid md:grid-cols-2 gap-6">

          {scanResult?.vulnerabilities?.map((vuln, index) => (

            <div
              key={index}
              className={`
                rounded-3xl
                p-6
                border
                ${
                  vuln.severity === "Critical"
                    ? "bg-zinc-900 border-red-500"
                    : "bg-zinc-900 border-yellow-500"
                }
              `}
            >

              <h2
                className={`
                  text-2xl
                  font-bold
                  mb-3
                  ${
                    vuln.severity === "Critical"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                `}
              >
                {vuln.title}
              </h2>

              <p className="text-gray-400">

                Severity Level:
                {" "}
                {vuln.severity}

              </p>

              <button
                className={`
                  mt-5
                  px-5
                  py-2
                  rounded-xl
                  font-bold
                  ${
                    vuln.severity === "Critical"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                  }
                `}
              >
                View Fix
              </button>

            </div>

          ))}

        </div>

        {/* SECURITY CHART */}
        <SecurityChart />

        {/* RECENT SCANS */}
        <div
          className="
          mt-10
          bg-zinc-900
          rounded-3xl
          p-6
          border
          border-zinc-800
        "
        >

          <h2 className="text-2xl font-bold mb-6 text-cyan-400">

            Recent Repository Scans

          </h2>

          <table className="w-full text-left">

            <thead>

              <tr
                className="
                text-gray-400
                border-b
                border-zinc-700
              "
              >

                <th className="pb-4">
                  Repository
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4">
                  Risk
                </th>

                <th className="pb-4">
                  Last Scan
                </th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b border-zinc-800">

                <td className="py-4">
                  SecureAgent-AI
                </td>

                <td className="text-red-400">
                  Critical
                </td>

                <td>
                  High
                </td>

                <td>
                  2 mins ago
                </td>

              </tr>

              <tr className="border-b border-zinc-800">

                <td className="py-4">
                  Banking-App
                </td>

                <td className="text-yellow-400">
                  Warning
                </td>

                <td>
                  Medium
                </td>

                <td>
                  10 mins ago
                </td>

              </tr>

              <tr>

                <td className="py-4">
                  Portfolio-Website
                </td>

                <td className="text-green-400">
                  Safe
                </td>

                <td>
                  Low
                </td>

                <td>
                  30 mins ago
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

