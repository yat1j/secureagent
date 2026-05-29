import { useEffect, useRef, useState } from 'react'

function buildMarkdown(sessionId, score) {
  return `![SecureAgent Score: ${score}](https://yourapp/badge/${sessionId}.svg)`
}

export default function BadgePreview({ sessionId, score }) {
  const [badgeSrc, setBadgeSrc] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef(null)
  const objectUrlRef = useRef(null)

  const markdown = buildMarkdown(sessionId, score)

  useEffect(() => {
    if (!sessionId) return undefined

    let cancelled = false

    fetch(`/badge/${sessionId}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error('Badge not found')
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current)
        }
        const url = URL.createObjectURL(blob)
        objectUrlRef.current = url
        setBadgeSrc(url)
        setLoadError(false)
      })
      .catch(() => {
        if (!cancelled) {
          setBadgeSrc(null)
          setLoadError(true)
        }
      })

    return () => {
      cancelled = true
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [sessionId])

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    },
    [],
  )

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-100">Get your badge</h2>

      <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
        <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-gray-800 bg-gray-900/60 p-4">
          {badgeSrc && !loadError ? (
            <img
              src={badgeSrc}
              alt={`SecureAgent security score: ${score}`}
              className="max-h-20"
            />
          ) : loadError ? (
            <p className="text-sm text-red-400">Could not load badge.</p>
          ) : (
            <p className="text-sm text-gray-500">Loading badge…</p>
          )}
        </div>

        <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 font-mono text-sm text-green-400">
          {markdown}
        </pre>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950"
        >
          {copied ? 'Copied ✓' : 'Copy badge'}
        </button>
      </div>
    </section>
  )
}
