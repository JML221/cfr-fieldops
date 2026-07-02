'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (res.ok) {
      const next = searchParams.get('next') || '/'
      router.push(next)
      router.refresh()
    } else {
      setError('Incorrect password.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-6 rounded-sm bg-brand" />
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-brand">
              Field Operations
            </div>
            <div className="text-lg font-bold text-white leading-tight">
              Field Advisor
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-edge rounded-lg p-6 flex flex-col gap-4">
          <p className="text-sm text-muted">Enter the access password to continue.</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            className="bg-canvas border border-edge rounded px-3 py-2 text-white text-sm placeholder:text-muted focus:outline-none focus:border-brand"
          />

          {error && <p className="text-danger text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand text-canvas font-semibold text-sm py-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          For internal use only. Not for distribution.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
