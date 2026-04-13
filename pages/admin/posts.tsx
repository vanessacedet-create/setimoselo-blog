import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllPosts, PostMeta } from '../../lib/posts'

interface Props {
  posts: PostMeta[]
}

export default function AdminPosts({ posts }: Props) {
  const [filtro, setFiltro] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lista, setLista] = useState(posts)

  const filtrados = lista.filter(p =>
    p.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filtro.toLowerCase())
  )

  async function handleDelete(slug: string) {
    if (confirmDelete !== slug) {
      setConfirmDelete(slug)
      return
    }
    setLoading(true)
    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) {
      setLista(prev => prev.filter(p => p.slug !== slug))
      setConfirmDelete(null)
    } else {
      alert('Erro ao excluir artigo.')
    }
  }

  return (
    <AdminLayout titulo="Artigos">
      <div className="admin-header-bar">
        <h1 className="admin-page-title">Artigos ({lista.length})</h1>
        <Link href="/admin/novo" className="btn-ler">+ Novo Artigo</Link>
      </div>

      <div className="admin-card">
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Filtrar por título ou categoria..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>

        {filtrados.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
            {lista.length === 0 ? (
              <>Nenhum artigo ainda. <Link href="/admin/novo">Criar o primeiro →</Link></>
            ) : 'Nenhum artigo corresponde ao filtro.'}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Data</th>
                <th>Leitura</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(post => (
                <tr key={post.slug}>
                  <td style={{ fontWeight: 500, maxWidth: '300px' }}>
                    <Link href={`/admin/editar/${post.slug}`} style={{ color: 'var(--bordo-deep)' }}>
                      {post.titulo}
                    </Link>
                  </td>
                  <td>
                    <span style={{
                      background: 'var(--creme-dark)', color: 'var(--ouro-dark)',
                      padding: '0.15rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      {post.categoria}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#888' }}>{post.data}</td>
                  <td style={{ fontSize: '0.85rem', color: '#888' }}>{post.tempoLeitura} min</td>
                  <td>
                    {post.publicado
                      ? <span className="badge-publicado">Publicado</span>
                      : <span className="badge-rascunho">Rascunho</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <Link href={`/admin/editar/${post.slug}`} style={{ fontSize: '0.82rem', color: 'var(--bordo)' }}>
                        ✏️ Editar
                      </Link>
                      <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#888' }}>
                        👁 Ver
                      </a>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        disabled={loading}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: confirmDelete === post.slug ? '#e74c3c' : '#ccc',
                          fontWeight: confirmDelete === post.slug ? 700 : 400,
                        }}
                      >
                        {confirmDelete === post.slug ? '⚠ Confirmar exclusão' : '🗑 Excluir'}
                      </button>
                      {confirmDelete === post.slug && (
                        <button
                          onClick={() => setConfirmDelete(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: '#aaa' }}
                        >
                          Cancelar
                        </button>
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
  const posts = getAllPosts(false)
  return { props: { posts } }
}
