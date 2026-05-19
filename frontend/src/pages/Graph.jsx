import { useRepo } from '../RepoContext'
import { useNavigate } from 'react-router-dom'

export default function Graph() {
  const { repoData } = useRepo()
  const navigate = useNavigate()

  if (!repoData) return (
    <div className="text-center py-32">
      <p className="text-gray-400 text-xl mb-4">No data yet.</p>
      <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
        ← Go Analyze a Repo
      </button>
    </div>
  )

  const { graph } = repoData

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-8">🧠 Code Knowledge Graph</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-indigo-400 mb-2">{graph.total_files}</div>
          <div className="text-gray-400">Total Files</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">{graph.total_connections}</div>
          <div className="text-gray-400">File Connections</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{graph.hotspots.length}</div>
          <div className="text-gray-400">Hotspot Files</div>
        </div>
      </div>

      {/* Hotspots */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-4">🔥 Hotspot Files</h3>
        <p className="text-gray-400 text-sm mb-4">
          Files that change most often and are connected to many other files.
        </p>
        <div className="space-y-3">
          {graph.hotspots.map((file, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl">
              <span className="text-yellow-400 font-bold w-6">{i + 1}</span>
              <span className="text-white flex-1 font-mono text-sm truncate">{file.id}</span>
              <span className="text-gray-400 text-xs">{file.commits} commits</span>
              <span className="text-indigo-400 text-xs">{file.connections} connections</span>
            </div>
          ))}
        </div>
      </div>

      {/* File Connections Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">🔗 File Connections</h3>
        <p className="text-gray-400 text-sm mb-4">
          Files that frequently change together are likely related.
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {graph.edges.slice(0, 20).map((edge, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg text-sm">
              <span className="text-indigo-400 font-mono truncate flex-1">{edge.source}</span>
              <span className="text-gray-500">↔</span>
              <span className="text-green-400 font-mono truncate flex-1">{edge.target}</span>
              <span className="text-yellow-400 text-xs">{edge.weight}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}