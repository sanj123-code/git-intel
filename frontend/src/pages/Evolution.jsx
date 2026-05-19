import { useRepo } from '../RepoContext'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Evolution() {
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

  // Build cumulative commit data for evolution chart
  let cumulative = 0
  const evolutionData = repoData.daily_activity.map(d => {
    cumulative += d.commits
    return {
      date: d.date,
      commits: d.commits,
      total: cumulative
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-8">📈 Repository Evolution</h2>

      {/* Cumulative Growth Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-2">📈 Cumulative Commit Growth</h3>
        <p className="text-gray-400 text-sm mb-6">
          How the repository has grown over time.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Commits Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-2">📅 Daily Commit Frequency</h3>
        <p className="text-gray-400 text-sm mb-6">
          Commit activity day by day.
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">🕐 Commit Timeline</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {repoData.recent_commits.map((commit, i) => (
            <div key={i} className="flex items-start gap-4 p-3 bg-gray-800 rounded-xl">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1"></div>
                {i < repoData.recent_commits.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-700 mt-1"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{commit.message}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {commit.author} • {commit.date}
                </p>
              </div>
              <span className="text-xs font-mono bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                {commit.hash}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}