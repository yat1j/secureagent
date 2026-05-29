const BASE_URL = 'http://localhost:8000'

export async function scanRepo(url) {
  try {
    const response = await fetch(`${BASE_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Scan failed (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function getReport(sessionId) {
  try {
    const response = await fetch(`${BASE_URL}/report/${sessionId}`)

    if (!response.ok) {
      throw new Error(`Get report failed (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function sendChat(sessionId, question) {
  try {
    const response = await fetch(`${BASE_URL}/chat/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      throw new Error(`Chat failed (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export function getBadgeUrl(sessionId) {
  return `${BASE_URL}/badge/${sessionId}.svg`
}
