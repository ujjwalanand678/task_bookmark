'use client'

import { signInWithGoogle } from '@/lib/auth/actions'
import { Bookmark, Sparkles, ShieldCheck, Zap } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
      
      <div className="max-w-xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-500/10 animate-bounce duration-[3000ms]">
              <Bookmark className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
              Organize your <br /> 
              <span className="text-blue-500">Digital World.</span>
            </h1>
            <p className="text-neutral-400 text-lg sm:text-xl max-w-sm mx-auto font-medium">
              A lightning-fast, private, and real-time bookmark manager for modern thinkers.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-extrabold py-4 px-8 rounded-2xl hover:bg-neutral-200 transition-all duration-300 active:scale-[0.98] shadow-2xl shadow-white/10 group"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6 group-hover:rotate-12 transition-transform" alt="Google" />
            Continue with Google
          </button>
          
          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-bold text-neutral-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Private
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              Real-time
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Cloud Sync
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
    </div>
  )
}
