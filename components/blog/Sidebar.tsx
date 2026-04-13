import React from 'react'
import Link from 'next/link'
import { PostMeta } from '../../lib/posts'
import { SiteSettings } from '../../lib/settings'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  recentes: PostMeta[]
  categorias: { nome: string; count: number }[]
  settings: SiteSettings
}

export default function Sidebar({ recentes, categorias, settings }: Props) {
  const [busca, setBusca] = React.useState('')
  const router = typeof window !== 'undefined' ? null : null

  function handleBusca(e: React.FormEvent) {
    e.preventDefault()
    if (busca.trim()) window.location.href = `/busca?q=${encodeURIComponent(busca.trim())}`
  }

  return (
    <aside className="sidebar">
      {/* Busca */}
      <div className="sidebar-widget">
        <div className="sidebar-widget-header">
          <h3 className="sidebar-widget-title">🔍 Buscar</h3>
        </div>
        <div className="sidebar-widget-body">
          <form onSubmit={handleBusca} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar artigos..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ margin: 0 }}
            />
            <button type="submit" className="btn-ler" style={{ flexShrink: 0, padding: '0.5rem 0.8rem' }}>
              →
            </button>
          </form>
        </div>
      </div>

      {/* Posts recentes */}
      {recentes.length > 0 && (
        <div className="sidebar-widget">
          <div className="sidebar-widget-header">
            <h3 className="sidebar-widget-title">📚 Artigos Recentes</h3>
          </div>
          <div className="sidebar-widget-body">
            {recentes.map(post => (
              <div key={post.slug} className="post-recente">
                {post.imagem && (
                  <div className="post-recente-img">
                    <Link href={`/post/${post.slug}`}>
                      <img src={post.imagem} alt={post.titulo} />
                    </Link>
                  </div>
                )}
                <div className="post-recente-info">
                  <div className="post-recente-title">
                    <Link href={`/post/${post.slug}`}>{post.titulo}</Link>
                  </div>
                  {post.data && (
                    <div className="post-recente-date">
                      {format(new Date(post.data + 'T00:00:00'), "d 'de' MMMM", { locale: ptBR })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorias */}
      {categorias.length > 0 && (
        <div className="sidebar-widget">
          <div className="sidebar-widget-header">
            <h3 className="sidebar-widget-title">📂 Categorias</h3>
          </div>
          <div className="sidebar-widget-body" style={{ padding: '0.5rem 1rem' }}>
            <ul className="cat-list">
              {categorias.map(cat => (
                <li key={cat.nome}>
                  <Link href={`/categoria/${encodeURIComponent(cat.nome)}`}>
                    {cat.nome}
                    <span className="cat-count">{cat.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Redes sociais */}
      {(settings.instagram || settings.facebook || settings.youtube || settings.whatsapp) && (
        <div className="sidebar-widget">
          <div className="sidebar-widget-header">
            <h3 className="sidebar-widget-title">🌐 Redes Sociais</h3>
          </div>
          <div className="sidebar-widget-body">
            <div className="social-links">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                  📷 Instagram
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                  👍 Facebook
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
                  ▶️ YouTube
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="social-link">
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link da loja */}
      {settings.linkLoja && (
        <div className="sidebar-widget">
          <div className="sidebar-widget-header">
            <h3 className="sidebar-widget-title">📖 Nossa Livraria</h3>
          </div>
          <div className="sidebar-widget-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--texto-suave)', marginBottom: '1rem' }}>
              Conheça o catálogo completo da Editora Sétimo Selo.
            </p>
            <a href={settings.linkLoja} target="_blank" rel="noopener noreferrer" className="btn-ouro" style={{ fontSize: '0.85rem' }}>
              Visitar a Loja →
            </a>
          </div>
        </div>
      )}
    </aside>
  )
}
