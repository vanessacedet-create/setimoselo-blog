import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  facebook:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  youtube:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>,
  twitter:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M13.232 10.768L20 4"/></svg>,
  tiktok:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
  whatsapp:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
}

interface Settings {
  storeUrl?: string
  instagram?: string
  facebook?: string
  youtube?: string
  twitter?: string
  tiktok?: string
  whatsapp?: string
  logo?: string
  nome?: string
  [key: string]: string | undefined
}

interface Categoria { id: string; slug: string; label: string }

export default function Header({ categorias = [], settings = {} }: { categorias?: Categoria[]; settings?: Settings }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const storeUrl = settings.storeUrl || 'https://editorasetimoselo.com.br'
  const socials = ['instagram', 'facebook', 'youtube', 'twitter', 'tiktok', 'whatsapp'].filter(k => settings[k])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="relative bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={settings.logo || '/images/logo.png'}
              alt={settings.nome || 'Editora Sétimo Selo'}
              className="h-10 md:h-12 w-auto"
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                const next = t.nextSibling as HTMLElement
                if (next) next.style.display = 'flex'
              }}
            />
            <span className="hidden items-center gap-2" style={{ display: 'none' }}>
              <span className="font-display text-lg font-bold tracking-wide" style={{ color: 'var(--bordo-dark)' }}>
                {settings.nome || 'Sétimo Selo'}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 font-display text-xs tracking-[0.18em] uppercase font-semibold">
            <Link href="/" className="text-ink/80 hover:text-bordo transition-colors duration-200" style={{ '--tw-text-opacity': 1 } as React.CSSProperties}>
              Início
            </Link>
            {categorias.map(cat => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`}
                className="transition-colors duration-200"
                style={{ color: 'rgba(18,18,18,0.8)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--bordo)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(18,18,18,0.8)')}>
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {socials.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {socials.map(key => (
                  <a key={key} href={key === 'whatsapp' ? `https://wa.me/${settings[key]}` : settings[key]}
                    target="_blank" rel="noopener noreferrer"
                    className="p-1 transition-colors duration-200"
                    style={{ color: 'rgba(18,18,18,0.35)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--bordo)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(18,18,18,0.35)')}>
                    {SOCIAL_ICONS[key]}
                  </a>
                ))}
                <span className="w-px h-5 bg-gray-200 mx-1" />
              </div>
            )}

            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full transition-all duration-200"
              style={{ color: 'rgba(18,18,18,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--bordo)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(18,18,18,0.4)')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* Loja */}
            <a href={storeUrl} target="_blank" rel="noopener noreferrer"
              className="hidden md:inline-block font-display text-xs tracking-[0.15em] uppercase font-semibold text-white px-5 py-2 transition-opacity duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }}>
              Loja
            </a>

            {/* Mobile toggle */}
            <button className="lg:hidden p-1 transition-colors" style={{ color: 'rgba(18,18,18,0.6)' }}
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-50 bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ouro)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input ref={searchInputRef} type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar artigos..."
                className="flex-1 font-serif text-lg outline-none bg-transparent placeholder-ink/30"
                style={{ color: 'var(--ink)' }} />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="font-display text-xs tracking-widest uppercase font-semibold transition-colors"
                style={{ color: 'rgba(18,18,18,0.4)' }}>
                Fechar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
            <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase font-semibold transition-colors"
              style={{ color: 'rgba(18,18,18,0.8)' }} onClick={() => setMenuOpen(false)}>Início</Link>
            {categorias.map(cat => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`}
                className="font-display text-xs tracking-[0.2em] uppercase font-semibold transition-colors"
                style={{ color: 'rgba(18,18,18,0.8)' }} onClick={() => setMenuOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {socials.length > 0 && (
              <div className="flex items-center gap-3 py-1">
                {socials.map(key => (
                  <a key={key} href={key === 'whatsapp' ? `https://wa.me/${settings[key]}` : settings[key]}
                    target="_blank" rel="noopener noreferrer" className="p-1" style={{ color: 'rgba(18,18,18,0.4)' }}>
                    {SOCIAL_ICONS[key]}
                  </a>
                ))}
              </div>
            )}
            <a href={storeUrl} target="_blank" rel="noopener noreferrer"
              className="font-display text-xs tracking-[0.2em] uppercase font-semibold transition-colors"
              style={{ color: 'var(--bordo)' }} onClick={() => setMenuOpen(false)}>
              Loja ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
