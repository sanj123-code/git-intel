import { useRepo } from '../RepoContext'
import { useNavigate } from 'react-router-dom'
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function Health() {
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

  const { health } = repoData

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 70) return '✅ Healthy'
    if (score >= 40) return '⚠️ Moderate'
    return '❌ Needs Work'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-8">❤️ Repository Health</h2>

      {/* Main Health Score */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 text-center">
        <div className={`text-8xl font-bold mb-2 ${getScoreColor(health.health_score)}`}>
          {health.health_score}
        </div>
        <div className="text-2xl text-white mb-1">Overall Health Score</div>
        <div className="text-lg">{getScoreLabel(health.health_score)}</div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(health.activity_score)}`}>
            {health.activity_score}
          </div>
          <div className="text-white font-medium">Activity Score</div>
          <div className="text-gray-400 text-sm mt-1">Based on commit frequency</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(health.collaboration_score)}`}>
            {health.collaboration_score}
          </div>
          <div className="text-white font-medium">Collaboration Score</div>
          <div className="text-gray-400 text-sm mt-1">Based on contributor count</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-indigo-400 mb-2">{health.bus_factor}</div>
          <div className="text-white font-medium">Bus Factor</div>
          <div className="text-gray-400 text-sm mt-1">People owning 80% of code</div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-6">📅 Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={health.weekly_activity}>
            <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="commits" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Author Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">👥 Author Breakdown</h3>
        <div className="space-y-3">
          {health.author_breakdown.map((a, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-gray-400 w-6">{i + 1}.</span>
              <span className="text-white flex-1">{a.name}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(a.commits / health.author_breakdown[0].commits) * 100}%` }}
                />
              </div>
              <span className="text-green-400 w-16 text-right">{a.commits} commits</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}