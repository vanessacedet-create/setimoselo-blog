import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

interface Props { children: React.ReactNode; titulo: string }

const navItems = [
  { href: '/admin',              label: 'Dashboard',   icon: '📊' },
  { href: '/admin/posts',        label: 'Artigos',      icon: '📝' },
  { href: '/admin/novo',         label: 'Novo Artigo',  icon: '✏️' },
  { href: '/admin/configuracoes',label: 'Configurações',icon: '⚙️' },
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
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(208,171,88,0.25)' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--ouro-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ⚜ Sétimo Selo
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem' }}>Painel Admin</div>
          </div>

          <nav style={{ padding: '1rem 0', flex: 1 }}>
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                className={`admin-nav-item${router.pathname === item.href ? ' active' : ''}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(208,171,88,0.15)' }}>
            <a href="/" target="_blank"
              style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.6rem', textDecoration: 'none' }}>
              👁 Ver blog →
            </a>
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', padding: '0.4rem 0.8rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem', width: '100%' }}>
              🚪 Sair
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </>
  )
}
