import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

interface Props {
  children: React.ReactNode
  titulo: string
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/posts', label: 'Artigos', icon: '📝' },
  { href: '/admin/novo', label: 'Novo Artigo', icon: '✏️' },
  { href: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
]

export default function AdminLayout({ children, titulo }: Props) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{titulo} | Admin Sétimo Selo</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-sidebar-logo">⚜ Sétimo Selo</div>
            <div className="admin-sidebar-subtitle">Painel Administrativo</div>
          </div>

          <nav className="admin-nav">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item${router.pathname === item.href ? ' ativo' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(208,171,88,0.2)' }}>
            <a
              href="/"
              target="_blank"
              style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '0.6rem', textDecoration: 'none' }}
            >
              👁 Ver blog público →
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)', padding: '0.4rem 0.8rem',
                borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem', width: '100%',
              }}
            >
              🚪 Sair
            </button>
          </div>
        </aside>

        <main className="admin-main">
          {children}
        </main>
      </div>
    </>
  )
}
