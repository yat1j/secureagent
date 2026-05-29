export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
      
      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        SecureAgent
      </h1>

      <div className="space-y-6">

        <button className="block text-left w-full text-lg hover:text-cyan-400">
          Dashboard
        </button>

        <button className="block text-left w-full text-lg hover:text-cyan-400">
          Scan Reports
        </button>

        <button className="block text-left w-full text-lg hover:text-cyan-400">
          Vulnerabilities
        </button>

        <button className="block text-left w-full text-lg hover:text-cyan-400">
          Settings
        </button>

      </div>

    </div>
  )
}