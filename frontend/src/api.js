import axios from 'axios'

// This is the address of our Python backend
const BASE_URL = 'http://localhost:8000'

export const analyzeRepo = async (repoUrl) => {
  const response = await axios.post(`${BASE_URL}/analyze`, {
    repo_url: repoUrl
  })
  return response.data
}