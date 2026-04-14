import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllPosts, getAllCategories } from '../../lib/posts'

interface Props {
  totalPosts: number; totalPublicados: number; totalRascunhos: number; totalCategorias: number
  ultimosPosts: { slug: string; titulo: string; data: string; publicado: boolean }[]
}

const card = (icon: string, valor: number, label: string, cor: string) => (
  <div key={label} style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc', textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontSize: '2rem', fontFamily: 'Cormorant, serif', fontWeight: 700, color: cor }}>{valor}</div>
    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
  </div>
)

export default function AdminDashboard({ totalPosts, totalPublicados, totalRascunhos, totalCategorias, ultimosPosts }: Props) {
  return (
    <AdminLayout titulo="Dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--bordo-dark)' }}>Dashboard</h1>
        <Link href="/admin/novo" style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '3px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
          + Novo Artigo
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {card('📝', totalPosts, 'Total', 'var(--bordo)')}
        {card('✅', totalPublicados, 'Publicados', '#27ae60')}
        {card('🗒', totalRascunhos, 'Rascunhos', '#f39c12')}
        {card('📂', totalCategorias, 'Categorias', 'var(--ouro-dark)')}
      </div>

      <div style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Cormorant, serif', fontSize: '1.2rem', color: 'var(--bordo-dark)' }}>Artigos Recentes</h2>
          <Link href="/admin/posts" style={{ fontSize: '0.85rem', color: 'var(--bordo)' }}>Ver todos →</Link>
        </div>
        {ultimosPosts.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
            Nenhum artigo ainda. <Link href="/admin/novo" style={{ color: 'var(--bordo)' }}>Criar o primeiro →</Link>
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f5ede0' }}>
                {['Título', 'Data', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 700, color: 'var(--bordo-dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid #e0d8cc' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ultimosPosts.map(post => (
                <tr key={post.slug} style={{ borderBottom: '1px solid #f0e8d8' }}>
                  <td style={{ padding: '0.7rem 0.8rem', fontWeight: 500 }}>{post.titulo}</td>
                  <td style={{ padding: '0.7rem 0.8rem', color: '#888', fontSize: '0.85rem' }}>{post.data}</td>
                  <td style={{ padding: '0.7rem 0.8rem' }}>
                    <span className={post.publicado ? 'badge-pub' : 'badge-draft'}>
                      {post.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 0.8rem' }}>
                    <Link href={`/admin/editar/${post.slug}`} style={{ color: 'var(--bordo)', fontSize: '0.82rem', marginRight: '0.8rem' }}>Editar</Link>
                    <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888', fontSize: '0.82rem' }}>Ver</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } }
  const allPosts = getAllPosts(false)
  return {
    props: {
      totalPosts: allPosts.length,
      totalPublicados: allPosts.filter(p => p.publicado).length,
      totalRascunhos: allPosts.filter(p => !p.publicado).length,
      totalCategorias: getAllCategories().length,
      ultimosPosts: allPosts.slice(0, 8).map(p => ({ slug: p.slug, titulo: p.titulo, data: p.data, publicado: p.publicado })),
    }
  }
}
