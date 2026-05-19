import { Link, useLocation } from 'react-router-dom'

const links = [
  { path: '/',          label: '🏠 Home'       },
  { path: '/commits',   label: '📊 Commits'    },
  { path: '/graph',     label: '🧠 Graph'      },
  { path: '/health',    label: '❤️ Health'     },
  { path: '/evolution', label: '📈 Evolution'  },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="text-xl font-bold text-white">Git Intel</span>
          <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
            AI Powered
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  )
}