import { useEffect, useState } from 'react'

const STORAGE_KEY = 'iu-chat-cookie-consent'

type ConsentValue = 'accepted' | 'declined'

function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ConsentValue | null
    if (!saved) {
      setOpen(true)
    }
  }, [])

  const handleChoice = (value: ConsentValue) => {
    window.localStorage.setItem(STORAGE_KEY, value)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center sm:justify-end pointer-events-none px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto max-w-md w-full rounded-2xl bg-white shadow-2xl p-5 sm:p-6 relative border border-slate-200">
        <button
          aria-label="Close cookie notice"
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          onClick={() => handleChoice('declined')}
        >
          ×
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
          Welcome to IU Chat!
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          In order to provide a more relevant experience for you, we use cookies to
          enable some website functionality. We are committed to transparency,
          trustworthiness, and honesty in all our interactions. Your privacy and
          trust are our top priorities.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="w-full sm:w-auto rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => handleChoice('declined')}
          >
            Decline
          </button>
          <button
            className="w-full sm:w-auto rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-900 transition-colors"
            onClick={() => handleChoice('accepted')}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent


