import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SiteSettings } from '../../lib/settings'
import Script from 'next/script'

interface Props {
  children: React.ReactNode
  settings: SiteSettings
  title?: string
  description?: string
  ogImage?: string
}

export default function Layout({ children, settings, title, description, ogImage }: Props) {
  const router = useRouter()
  const pageTitle = title ? `${title} | ${settings.nome}` : settings.nome
  const pageDesc = description || settings.descricao

  const [busca, setBusca] = React.useState('')

  function handleBusca(e: React.FormEvent) {
    e.preventDefault()
    if (busca.trim()) router.push(`/busca?q=${encodeURIComponent(busca.trim())}`)
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {settings.googleAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.googleAnalytics}');
          `}</Script>
        </>
      )}

      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="header-logo">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.nome} />
            ) : (
              <span className="header-logo-text">{settings.nome}</span>
            )}
          </Link>

          <nav className="header-nav">
            <Link href="/">Início</Link>
            <Link href="/categorias">Categorias</Link>
            {settings.linkLoja && (
              <a href={settings.linkLoja} target="_blank" rel="noopener noreferrer">Loja</a>
            )}
          </nav>

          <form className="header-search" onSubmit={handleBusca}>
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-marca-nome">{settings.nome}</div>
            <p className="footer-marca-desc">{settings.descricao}</p>
            {settings.linkLoja && (
              <a href={settings.linkLoja} target="_blank" rel="noopener noreferrer" className="btn-ouro" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
                Visitar a Livraria
              </a>
            )}
          </div>

          <div>
            <div className="footer-heading">Navegação</div>
            <ul className="footer-links">
              <li><Link href="/">Início</Link></li>
              <li><Link href="/categorias">Categorias</Link></li>
              <li><Link href="/busca">Busca</Link></li>
              {settings.linkLoja && <li><a href={settings.linkLoja} target="_blank" rel="noopener noreferrer">Loja</a></li>}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Redes Sociais</div>
            <ul className="footer-links">
              {settings.instagram && <li><a href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
              {settings.facebook && <li><a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
              {settings.youtube && <li><a href={settings.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>}
              {settings.whatsapp && <li><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span dangerouslySetInnerHTML={{ __html: settings.rodape }} />
          <a href="/admin">Admin</a>
        </div>
      </footer>
    </>
  )
}
