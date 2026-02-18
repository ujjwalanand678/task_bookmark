'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/actions'
import { Trash2, Plus, LogOut, Bookmark as BookmarkIcon, ExternalLink, ShieldCheck, Search, Loader2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Bookmark {
  id: string
  url: string
  title: string
  created_at: string
}

export default function Dashboard({ user }: { user: User }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id])

  async function fetchBookmarks() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
    setIsLoading(false)
  }

  async function addBookmark(e: React.FormEvent) {
    e.preventDefault()
    if (!newUrl || !newTitle) return
    
    setIsSubmitting(true)

    // Basic URL validation
    let formattedUrl = newUrl
    if (!/^https?:\/\//i.test(newUrl)) {
      formattedUrl = `https://${newUrl}`
    }

    const { error } = await supabase.from('bookmarks').insert([
      {
        url: formattedUrl,
        title: newTitle,
        user_id: user.id,
      },
    ])

    if (error) {
      alert('Error adding bookmark: ' + error.message)
    } else {
      setNewUrl('')
      setNewTitle('')
    }
    setIsSubmitting(false)
  }

  async function deleteBookmark(id: string) {
    if (!confirm('Are you sure you want to delete this bookmark?')) return
    
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) {
      alert('Error deleting bookmark: ' + error.message)
    }
  }

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-500/30">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <nav className="border-b border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1.5 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <BookmarkIcon className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              MarkIt
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
              {user.user_metadata.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt={user.user_metadata.full_name || 'User'} 
                  className="w-5 h-5 rounded-full border border-neutral-700"
                />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              )}
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-white mb-0.5">
                  {user.user_metadata.full_name || 'Anonymous User'}
                </span>
                <span className="text-[9px] font-medium text-neutral-500">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="group flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors pl-2"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 relative">
        {/* Search & Stats Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Your Collection</h1>
            <p className="text-neutral-500">Manage and access your saved resources anywhere.</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Add Bookmark Section */}
        <section className="bg-neutral-900/40 border border-neutral-800/60 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Plus className="w-32 h-32" />
          </div>
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-lg font-bold">Quick Save</h2>
            </div>
            
            <form onSubmit={addBookmark} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2 ml-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js Documentation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
                  required
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-2 ml-1">URL</label>
                <input
                  type="text"
                  placeholder="github.com/vercel/next.js"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-neutral-700"
                  required
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold h-[48px] rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  <span>{isSubmitting ? 'Saving' : 'Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Bookmark Grid */}
        <section className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 rounded-full border-t-2 border-blue-600 animate-spin" />
              <p className="text-neutral-500 animate-pulse font-medium">Curating your space...</p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-32 bg-neutral-900/20 border-2 border-dashed border-neutral-800/50 rounded-[2.5rem] flex flex-col items-center gap-4 group">
              <div className="p-6 bg-neutral-900 rounded-3xl group-hover:scale-110 transition-transform duration-500 border border-neutral-800">
                <BookmarkIcon className="w-12 h-12 text-neutral-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-300">
                  {searchQuery ? "No matches found" : "Empty Canvas"}
                </h3>
                <p className="text-neutral-500 max-w-xs mx-auto">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "Your digital library is waiting for its first entry."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group relative bg-neutral-900/40 border border-neutral-800 hover:border-blue-500/50 p-6 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 group-hover:border-blue-500/30 transition-colors">
                      <BookmarkIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <button
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="text-neutral-600 hover:text-red-500 p-2 rounded-xl hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {bookmark.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{bookmark.url.replace(/^https?:\/\//, '')}</span>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                        {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <a
                        href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 group/link"
                      >
                        Visit Site
                        <Plus className="w-3 h-3 rotate-45 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Quick Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-neutral-900 flex justify-between items-center text-xs font-medium text-neutral-600">
        <p>© 2026 MarkIt Bookmark Manager</p>
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Realtime Active
          </span>
        </div>
      </footer>
    </div>
  )
}
