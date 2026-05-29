import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const data = [
  { name: "Mon", vulnerabilities: 12 },
  { name: "Tue", vulnerabilities: 9 },
  { name: "Wed", vulnerabilities: 15 },
  { name: "Thu", vulnerabilities: 7 },
  { name: "Fri", vulnerabilities: 11 },
]

export default function SecurityChart() {
  return (
    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 mt-10">

      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Weekly Vulnerability Analytics
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#333" />

            <XAxis dataKey="name" stroke="#888" />

            <YAxis stroke="#888" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="vulnerabilities"
              stroke="#06b6d4"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}