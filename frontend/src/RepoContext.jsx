import { createContext, useContext, useState } from 'react'

const RepoContext = createContext()

export function RepoProvider({ children }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [repoData, setRepoData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  return (
    <RepoContext.Provider value={{
      repoUrl, setRepoUrl,
      repoData, setRepoData,
      isAnalyzing, setIsAnalyzing,
      error, setError
    }}>
      {children}
    </RepoContext.Provider>
  )
}

export function useRepo() {
  return useContext(RepoContext)
}