import { useRepo } from '../RepoContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function Commits() {
  const { repoData } = useRepo()
  const navigate = useNavigate()

  if (!repoData) return (
    <div className="text-center py-32">
      <p className="text-gray-400 text-xl mb-4">No data yet.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
      >
        ← Go Analyze a Repo
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-8">📊 Commit Analysis</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-indigo-400 mb-2">{repoData.total_commits}</div>
          <div className="text-gray-400">Total Commits</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">{repoData.total_authors}</div>
          <div className="text-gray-400">Contributors</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-2">
            {repoData.top_contributors[0]?.commits}
          </div>
          <div className="text-gray-400">Top Contributor Commits</div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-6">📅 Daily Commit Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={repoData.daily_activity}>
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Contributors */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-4">👥 Top Contributors</h3>
        <div className="space-y-3">
          {repoData.top_contributors.map((c, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-gray-400 w-6">{i + 1}.</span>
              <span className="text-white flex-1">{c.name}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${(c.commits / repoData.top_contributors[0].commits) * 100}%` }}
                />
              </div>
              <span className="text-indigo-400 w-16 text-right">{c.commits} commits</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Commits */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">🕐 Recent Commits</h3>
        <div className="space-y-3">
          {repoData.recent_commits.map((commit, i) => (
            <div key={i} className="flex items-start gap-4 p-3 bg-gray-800 rounded-xl">
              <span className="text-xs font-mono bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                {commit.hash}
              </span>
              <div className="flex-1">
                <p className="text-white text-sm">{commit.message}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {commit.author} • {commit.date} • {commit.files_changed} files changed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}