import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllPosts, getAllCategories } from '../../lib/posts'
import { getSettings } from '../../lib/settings'

interface Props {
  totalPosts: number
  totalPublicados: number
  totalRascunhos: number
  totalCategorias: number
  ultimosPosts: { slug: string; titulo: string; data: string; publicado: boolean }[]
}

export default function AdminDashboard({ totalPosts, totalPublicados, totalRascunhos, totalCategorias, ultimosPosts }: Props) {
  const stats = [
    { label: 'Total de Artigos', valor: totalPosts, icon: '📝', cor: 'var(--bordo)' },
    { label: 'Publicados', valor: totalPublicados, icon: '✅', cor: '#27ae60' },
    { label: 'Rascunhos', valor: totalRascunhos, icon: '🗒', cor: '#f39c12' },
    { label: 'Categorias', valor: totalCategorias, icon: '📂', cor: 'var(--ouro-dark)' },
  ]

  return (
    <AdminLayout titulo="Dashboard">
      <div className="admin-header-bar">
        <h1 className="admin-page-title">Dashboard</h1>
        <Link href="/admin/novo" className="btn-ler">
          + Novo Artigo
        </Link>
      </div>

      {/* Cards de estatísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(stat => (
          <div key={stat.label} className="admin-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: stat.cor }}>
              {stat.valor}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Últimos artigos */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--bordo-deep)' }}>
            Artigos Recentes
          </h2>
          <Link href="/admin/posts" style={{ fontSize: '0.85rem', color: 'var(--bordo)' }}>
            Ver todos →
          </Link>
        </div>

        {ultimosPosts.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
            Nenhum artigo ainda. <Link href="/admin/novo">Crie o primeiro →</Link>
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ultimosPosts.map(post => (
                <tr key={post.slug}>
                  <td style={{ fontWeight: 500 }}>{post.titulo}</td>
                  <td>{post.data}</td>
                  <td>
                    {post.publicado
                      ? <span className="badge-publicado">Publicado</span>
                      : <span className="badge-rascunho">Rascunho</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/editar/${post.slug}`} style={{ fontSize: '0.82rem', color: 'var(--bordo)' }}>
                        Editar
                      </Link>
                      <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#888' }}>
                        Ver
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="admin-card">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--bordo-deep)', marginBottom: '1rem' }}>
          Ações Rápidas
        </h2>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link href="/admin/novo" className="btn-ler">✏️ Novo Artigo</Link>
          <Link href="/admin/configuracoes" className="btn-ouro" style={{ fontSize: '0.82rem', padding: '0.5rem 1.2rem' }}>⚙️ Configurações</Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ler" style={{ background: '#555' }}>
            👁 Ver Blog
          </a>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } }

  const allPosts = getAllPosts(false)
  const publicados = allPosts.filter(p => p.publicado)
  const rascunhos = allPosts.filter(p => !p.publicado)
  const categorias = getAllCategories()
  const ultimosPosts = allPosts.slice(0, 8).map(p => ({
    slug: p.slug, titulo: p.titulo, data: p.data, publicado: p.publicado,
  }))

  return {
    props: {
      totalPosts: allPosts.length,
      totalPublicados: publicados.length,
      totalRascunhos: rascunhos.length,
      totalCategorias: categorias.length,
      ultimosPosts,
    }
  }
}
