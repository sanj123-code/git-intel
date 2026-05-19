import { useNavigate } from 'react-router-dom'
import { useRepo } from '../RepoContext'
import { analyzeRepo } from '../api'

export default function Home() {
  const navigate = useNavigate()
  const {
    repoUrl, setRepoUrl,
    setRepoData,
    isAnalyzing, setIsAnalyzing,
    error, setError
  } = useRepo()

  const handleAnalyze = async () => {
    if (!repoUrl) return
    setIsAnalyzing(true)
    setError(null)
    setRepoData(null)

    try {
      const result = await analyzeRepo(repoUrl)
      setRepoData(result.data)
      navigate('/commits')
    } catch (err) {
      setError('Failed to analyze repo. Make sure the URL is correct.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Understand Any
          <span className="text-indigo-400"> GitHub Repo </span>
          Instantly
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          AI-powered analysis of commits, contributors, code health,
          and repository evolution — all in one place.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex gap-3">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://github.com/owner/repository"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-lg"
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-center bg-red-500/10 rounded-xl p-3">
            ❌ {error}
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-4 text-center text-indigo-400 animate-pulse">
            🔍 Cloning and analyzing repository... this may take a minute
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { icon: '📥', title: 'Ingest Repo',      desc: 'Clone and parse any public GitHub repository instantly.'         },
          { icon: '📊', title: 'Analyze Commits',  desc: 'Deep dive into commit history and contributor patterns.'         },
          { icon: '🧠', title: 'Knowledge Graph',  desc: 'See how files and modules connect across your codebase.'        },
          { icon: '❤️', title: 'Health Metrics',   desc: 'Track bus factor, activity score, and maintainability.'         },
          { icon: '📈', title: 'Repo Evolution',   desc: 'Visualize how the repository has grown and changed over time.'  },
        ].map((card, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500 transition-colors text-center">
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-white font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-400 text-xs">{card.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}