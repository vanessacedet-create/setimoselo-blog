import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  id: string
  title: string
  date?: string
  excerpt?: string
  category?: string
  coverImage?: string
  readingTime?: number
  featured?: boolean
  variant?: 'default' | 'compact' | 'large' | 'horizontal' | 'related'
}

export default function PostCard({
  id, title, date, excerpt, category, coverImage, readingTime,
  featured = false, variant = 'default',
}: Props) {
  const formattedDate = date
    ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  // ─── FEATURED hero ───
  if (featured) {
    return (
      <Link href={`/post/${id}`} className="group block">
        <article className="relative text-white overflow-hidden gold-hover"
          style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }}>
          {coverImage && (
            <div className="absolute inset-0 opacity-20">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="relative p-10 md:p-14">
            {category && (
              <span className="inline-block w-fit font-display text-xs tracking-[0.3em] uppercase font-semibold mb-4 border px-3 py-1"
                style={{ color: 'var(--ouro)', borderColor: 'rgba(208,171,88,0.4)' }}>
                {category}
              </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5 transition-colors duration-300"
              style={{ color: 'white' }}>
              {title}
            </h2>
            {excerpt && (
              <p className="font-sans text-lg leading-relaxed mb-6 max-w-2xl"
                style={{ color: 'rgba(255,255,255,0.8)' }}>
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-4">
              <span className="font-sans text-sm" style={{ color: 'rgba(208,171,88,0.8)' }}>{formattedDate}</span>
              <span style={{ color: 'rgba(208,171,88,0.4)' }}>·</span>
              {readingTime && (
                <span className="font-sans text-sm" style={{ color: 'rgba(208,171,88,0.8)' }}>{readingTime} min de leitura</span>
              )}
              <span style={{ color: 'rgba(208,171,88,0.4)' }}>·</span>
              <span className="font-display text-xs tracking-widest uppercase font-semibold transition-colors"
                style={{ color: 'var(--ouro)' }}>
                Ler artigo →
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── COMPACT ───
  if (variant === 'compact') {
    return (
      <Link href={`/post/${id}`} className="group block h-full">
        <article className="h-full flex flex-col bg-white border border-gray-200 hover:border-bordo/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden frame-moldura">
              <img src={coverImage} alt={title}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-full h-44 flex items-center justify-center border-b border-gray-100"
              style={{ background: 'var(--parchment)' }}>
              <span className="font-display text-3xl" style={{ color: 'rgba(122,34,30,0.15)' }}>S</span>
            </div>
          )}
          <div className="p-5 flex-1 flex flex-col">
            {category && (
              <span className="inline-block w-fit font-display tracking-[0.2em] uppercase font-semibold mb-2 border px-2.5 py-0.5"
                style={{ fontSize: '10px', color: 'var(--bordo)', borderColor: 'rgba(122,34,30,0.25)' }}>
                {category}
              </span>
            )}
            <h3 className="font-serif text-lg font-bold leading-snug mb-2 line-clamp-2 transition-colors duration-200"
              style={{ color: 'var(--bordo-dark)' }}>
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-sm leading-relaxed line-clamp-2 mb-3 flex-1"
                style={{ color: 'rgba(18,18,18,0.7)' }}>
                {excerpt}
              </p>
            )}
            {!excerpt && <div className="flex-1" />}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-auto">
              {readingTime
                ? <span className="font-sans text-xs" style={{ color: 'rgba(18,18,18,0.45)' }}>{readingTime} min de leitura</span>
                : <span className="font-sans text-xs" style={{ color: 'rgba(18,18,18,0.45)' }}>{formattedDate}</span>
              }
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── LARGE ───
  if (variant === 'large') {
    return (
      <Link href={`/post/${id}`} className="group block h-full">
        <article className="h-full bg-white border border-gray-200 hover:border-bordo/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden frame-moldura">
              <img src={coverImage} alt={title}
                className="w-full h-56 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-full h-56 md:h-72 flex items-center justify-center border-b border-gray-100"
              style={{ background: 'var(--parchment)' }}>
              <span className="font-display text-5xl" style={{ color: 'rgba(122,34,30,0.15)' }}>S</span>
            </div>
          )}
          <div className="p-6 md:p-8">
            {category && (
              <span className="inline-block w-fit font-display text-xs tracking-[0.25em] uppercase font-semibold mb-3 border px-3 py-1"
                style={{ color: 'var(--bordo)', borderColor: 'rgba(122,34,30,0.25)' }}>
                {category}
              </span>
            )}
            <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3 transition-colors duration-200"
              style={{ color: 'var(--bordo-dark)' }}>
              {title}
            </h3>
            {excerpt && (
              <p className="font-serif text-base leading-relaxed line-clamp-3 mb-4"
                style={{ color: 'rgba(18,18,18,0.7)' }}>
                {excerpt}
              </p>
            )}
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs" style={{ color: 'rgba(18,18,18,0.45)' }}>{formattedDate}</span>
              {readingTime && (
                <>
                  <span style={{ color: 'rgba(18,18,18,0.2)' }}>·</span>
                  <span className="font-sans text-xs" style={{ color: 'rgba(18,18,18,0.45)' }}>{readingTime} min de leitura</span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // ─── HORIZONTAL ───
  if (variant === 'horizontal') {
    return (
      <Link href={`/post/${id}`} className="group block">
        <article className="flex gap-5 bg-white border border-gray-200 hover:border-bordo/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="w-32 md:w-40 flex-shrink-0 overflow-hidden frame-moldura">
              <img src={coverImage} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-32 md:w-40 flex-shrink-0 flex items-center justify-center border-r border-gray-100"
              style={{ background: 'var(--parchment)' }}>
              <span className="font-display text-2xl" style={{ color: 'rgba(122,34,30,0.15)' }}>S</span>
            </div>
          )}
          <div className="flex-1 py-4 pr-5">
            {category && (
              <span className="inline-block w-fit font-display text-xs tracking-[0.2em] uppercase font-semibold mb-1 border px-3 py-1"
                style={{ color: 'var(--bordo)', borderColor: 'rgba(122,34,30,0.25)' }}>
                {category}
              </span>
            )}
            <h3 className="font-serif text-base font-bold leading-snug mb-2 line-clamp-2 transition-colors duration-200"
              style={{ color: 'var(--bordo-dark)' }}>
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-sm line-clamp-2 mb-2 hidden md:block"
                style={{ color: 'rgba(18,18,18,0.6)' }}>
                {excerpt}
              </p>
            )}
            <span className="font-sans text-xs" style={{ color: 'rgba(18,18,18,0.45)' }}>
              {readingTime ? `${readingTime} min de leitura` : formattedDate}
            </span>
          </div>
        </article>
      </Link>
    )
  }

  // ─── RELATED ───
  if (variant === 'related') {
    return (
      <Link href={`/post/${id}`} className="group block h-full">
        <article className="h-full flex flex-col bg-white border border-gray-200 hover:border-bordo/30 transition-all duration-300 overflow-hidden">
          {coverImage ? (
            <div className="overflow-hidden h-40 frame-moldura">
              <img src={coverImage} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center border-b border-gray-100"
              style={{ background: 'var(--parchment)' }}>
              <span className="font-display text-2xl" style={{ color: 'rgba(122,34,30,0.15)' }}>S</span>
            </div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            {category && (
              <span className="inline-block w-fit font-display text-xs tracking-[0.2em] uppercase font-semibold mb-2 border px-3 py-1"
                style={{ color: 'var(--bordo)', borderColor: 'rgba(122,34,30,0.25)' }}>
                {category}
              </span>
            )}
            <h3 className="font-serif text-base font-bold leading-snug line-clamp-2 mb-2 flex-1 transition-colors duration-200"
              style={{ color: 'var(--ink)' }}>
              {title}
            </h3>
            {excerpt && (
              <p className="font-sans text-xs line-clamp-2 mb-2" style={{ color: 'rgba(18,18,18,0.5)' }}>{excerpt}</p>
            )}
            {readingTime && (
              <span className="font-sans text-xs mt-auto" style={{ color: 'rgba(18,18,18,0.35)' }}>{readingTime} min de leitura</span>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // ─── DEFAULT ───
  return (
    <Link href={`/post/${id}`} className="group block h-full">
      <article className="h-full border border-gray-200 hover:border-bordo/30 transition-all duration-300 p-6 gold-hover"
        style={{ background: 'var(--cream)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--parchment)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}>
        {category && (
          <span className="inline-block w-fit font-display text-xs tracking-[0.25em] uppercase font-semibold mb-3 border px-3 py-1"
            style={{ color: 'var(--bordo)', borderColor: 'rgba(122,34,30,0.25)' }}>
            {category}
          </span>
        )}
        <h2 className="font-serif text-xl font-bold leading-snug mb-3 transition-colors duration-200"
          style={{ color: 'var(--bordo-dark)' }}>
          {title}
        </h2>
        {excerpt && (
          <p className="font-sans text-base leading-relaxed mb-4 line-clamp-3"
            style={{ color: 'rgba(18,18,18,0.7)' }}>
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="font-sans text-xs" style={{ color: 'rgba(18,18,18,0.45)' }}>{formattedDate}</span>
          <span className="font-display text-xs tracking-wider uppercase font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: 'var(--bordo)' }}>
            Ler →
          </span>
        </div>
      </article>
    </Link>
  )
}
