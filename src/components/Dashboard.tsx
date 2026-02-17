'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/actions'
import { Trash2, Plus, LogOut, Bookmark as BookmarkIcon, ExternalLink } from 'lucide-react'
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
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBookmarks()

    // Real-time subscription
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

    const { error } = await supabase.from('bookmarks').insert([
      {
        url: newUrl,
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
  }

  async function deleteBookmark(id: string) {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) {
      alert('Error deleting bookmark: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Header */}
      <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="text-blue-500 w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">MarkIt</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-neutral-400">
              {user.email}
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors border border-neutral-700"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Add Bookmark Form */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Add New Bookmark
          </h2>
          <form onSubmit={addBookmark} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Title (e.g. Next.js Documentation)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
            <div className="lg:col-span-2">
              <input
                type="url"
                placeholder="URL (https://...)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Save Bookmark
            </button>
          </form>
        </section>

        {/* Bookmark List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Bookmarks</h2>
            <span className="text-sm text-neutral-500">{bookmarks.length} total</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/30 border border-dashed border-neutral-800 rounded-2xl">
              <BookmarkIcon className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No bookmarks yet. Start by adding one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group bg-neutral-900 border border-neutral-800 p-5 rounded-2xl hover:border-neutral-700 transition-all hover:shadow-2xl hover:shadow-black/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {bookmark.title}
                    </h3>
                    <button
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="text-neutral-500 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-neutral-400 text-sm line-clamp-1 mb-4 flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3" />
                    {bookmark.url}
                  </p>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Open Link
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
