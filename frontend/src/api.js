import axios from 'axios'

const BASE_URL = 'https://git-intel-backend.onrender.com'

export const analyzeRepo = async (repoUrl) => {
  const response = await axios.post(`${BASE_URL}/analyze`, {
    repo_url: repoUrl
  })
  return response.data
}