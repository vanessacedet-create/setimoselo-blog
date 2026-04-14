import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllPosts, PostMeta } from '../../lib/posts'

interface Props { posts: PostMeta[] }

export default function AdminPosts({ posts }: Props) {
  const [filtro, setFiltro] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [lista, setLista] = useState(posts)

  const filtrados = lista.filter(p =>
    p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filtro.toLowerCase())
  )

  async function handleDelete(slug: string) {
    if (confirmDelete !== slug) { setConfirmDelete(slug); return }
    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    if (res.ok) { setLista(prev => prev.filter(p => p.slug !== slug)); setConfirmDelete(null) }
    else alert('Erro ao excluir.')
  }

  return (
    <AdminLayout titulo="Artigos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--bordo-dark)' }}>
          Artigos ({lista.length})
        </h1>
        <Link href="/admin/novo" style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '3px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
          + Novo Artigo
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc' }}>
        <input className="form-input" style={{ maxWidth: '400px', marginBottom: '1.2rem' }}
          placeholder="Filtrar por título ou categoria..."
          value={filtro} onChange={e => setFiltro(e.target.value)} />

        {filtrados.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
            {lista.length === 0 ? <><Link href="/admin/novo" style={{ color: 'var(--bordo)' }}>Criar o primeiro artigo →</Link></> : 'Nenhum artigo corresponde ao filtro.'}
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f5ede0' }}>
                {['Título', 'Categoria', 'Data', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 700, color: 'var(--bordo-dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid #e0d8cc' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(post => (
                <tr key={post.slug} style={{ borderBottom: '1px solid #f0e8d8' }}>
                  <td style={{ padding: '0.7rem 0.8rem', fontWeight: 500, maxWidth: '300px' }}>
                    <Link href={`/admin/editar/${post.slug}`} style={{ color: 'var(--bordo-dark)' }}>{post.titulo}</Link>
                  </td>
                  <td style={{ padding: '0.7rem 0.8rem' }}>
                    <span style={{ background: '#f5ede0', color: 'var(--ouro-dark)', padding: '0.15rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
                      {post.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 0.8rem', color: '#888', fontSize: '0.85rem' }}>{post.data}</td>
                  <td style={{ padding: '0.7rem 0.8rem' }}>
                    <span className={post.publicado ? 'badge-pub' : 'badge-draft'}>
                      {post.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 0.8rem' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <Link href={`/admin/editar/${post.slug}`} style={{ color: 'var(--bordo)', fontSize: '0.82rem' }}>✏️ Editar</Link>
                      <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888', fontSize: '0.82rem' }}>👁 Ver</a>
                      <button onClick={() => handleDelete(post.slug)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: confirmDelete === post.slug ? '#e74c3c' : '#ccc', fontWeight: confirmDelete === post.slug ? 700 : 400 }}>
                        {confirmDelete === post.slug ? '⚠ Confirmar' : '🗑'}
                      </button>
                      {confirmDelete === post.slug && (
                        <button onClick={() => setConfirmDelete(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: '#aaa' }}>Cancelar</button>
                      )}
                    </div>
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
  return { props: { posts: getAllPosts(false) } }
}
