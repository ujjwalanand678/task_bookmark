'use client'

import { signInWithGoogle } from '@/lib/auth/actions'
import { Bookmark } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
            <Bookmark className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Save what <span className="text-blue-400">matters</span>.
          </h1>
          <p className="text-neutral-400 text-lg">
            A simple, real-time bookmark manager built for developers and readers.
          </p>
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-neutral-200 transition-all duration-200 active:scale-95 shadow-lg shadow-white/5"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="text-neutral-500 text-sm">
          No credit card required. Private by default.
        </p>
      </div>
    </div>
  )
}
