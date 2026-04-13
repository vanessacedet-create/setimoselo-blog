import Link from 'next/link'

interface Settings {
  nome?: string
  descricao?: string
  storeUrl?: string
  email?: string
  instagram?: string
  facebook?: string
  youtube?: string
  twitter?: string
  tiktok?: string
  whatsapp?: string
  [key: string]: string | undefined
}

export default function Footer({ settings = {} }: { settings?: Settings }) {
  const year = new Date().getFullYear()
  const storeUrl = settings.storeUrl || 'https://editorasetimoselo.com.br'
  const socials = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook',  label: 'Facebook' },
    { key: 'youtube',   label: 'YouTube' },
    { key: 'twitter',   label: 'X / Twitter' },
    { key: 'tiktok',    label: 'TikTok' },
    { key: 'whatsapp',  label: 'WhatsApp' },
  ].filter(s => settings[s.key])

  return (
    <footer style={{ background: '#1a0a09', color: 'rgba(253,248,240,0.7)' }}>
      <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, #d0ab58, transparent)' }} />
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-display text-xs tracking-[0.3em] uppercase font-semibold mb-2" style={{ color: 'var(--ouro)' }}>
              Editora Sétimo Selo
            </p>
            <h3 className="font-display text-xl mb-4" style={{ color: 'var(--cream)' }}>O Blog</h3>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(253,248,240,0.5)' }}>
              {settings.descricao || 'Literatura, espiritualidade e pensamento clássico.'}
            </p>
          </div>

          {/* Navegação */}
          <div className="text-center">
            <p className="font-display text-xs tracking-[0.3em] uppercase font-semibold mb-5" style={{ color: 'var(--ouro)' }}>
              Navegação
            </p>
            <ul className="space-y-3 font-sans text-sm">
              {[
                { href: '/', label: 'Início' },
                { href: '/categorias', label: 'Categorias' },
                { href: '/busca', label: 'Buscar' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="transition-colors"
                    style={{ color: 'rgba(253,248,240,0.6)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ouro-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,248,240,0.6)')}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: 'rgba(253,248,240,0.6)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ouro-light)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,248,240,0.6)')}>
                  Loja da Editora ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="text-center md:text-right">
            <p className="font-display text-xs tracking-[0.3em] uppercase font-semibold mb-5" style={{ color: 'var(--ouro)' }}>
              Contato
            </p>
            <ul className="space-y-3 font-sans text-sm">
              {socials.map(s => (
                <li key={s.key}>
                  <a href={s.key === 'whatsapp' ? `https://wa.me/${settings[s.key]}` : settings[s.key]}
                    target="_blank" rel="noopener noreferrer"
                    className="transition-colors"
                    style={{ color: 'rgba(253,248,240,0.6)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ouro-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,248,240,0.6)')}>
                    {s.label}
                  </a>
                </li>
              ))}
              {settings.email && (
                <li style={{ color: 'rgba(253,248,240,0.5)' }}>{settings.email}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(208,171,88,0.15)' }}>
          <p className="font-sans text-xs" style={{ color: 'rgba(253,248,240,0.35)' }}>
            © {year} Editora Sétimo Selo. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-display text-xs tracking-widest" style={{ color: 'rgba(208,171,88,0.4)' }}>
              Veritas et Pulchritudo
            </p>
            <Link href="/admin" className="font-sans text-xs transition-colors"
              style={{ color: 'rgba(253,248,240,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(208,171,88,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,248,240,0.2)')}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
