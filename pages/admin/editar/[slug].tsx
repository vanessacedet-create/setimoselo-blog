import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/admin/AdminLayout'
import PostEditor from '../../../components/admin/PostEditor'
import { getPostBySlug, Post } from '../../../lib/posts'
import { slugify } from '../../../lib/slugify'

interface Props {
  post: Post
}

export default function EditarPost({ post }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [form, setForm] = useState({
    titulo: post.titulo,
    slug: post.slug,
    excerpt: post.excerpt,
    categoria: post.categoria,
    autor: post.autor,
    data: post.data,
    imagem: post.imagem,
    tags: post.tags.join(', '),
    publicado: post.publicado,
    conteudo: post.conteudo,
  })

  function handleChange(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(publicar?: boolean) {
    if (!form.titulo.trim()) { setMsg('⚠ O título é obrigatório.'); return }
    setSaving(true)
    setMsg('')

    const payload = {
      ...form,
      publicado: publicar !== undefined ? publicar : form.publicado,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (res.ok) {
      setMsg('✅ Artigo salvo com sucesso!')
      setTimeout(() => setMsg(''), 3000)
    } else {
      const err = await res.json()
      setMsg('Erro: ' + (err.error || 'desconhecido'))
    }
  }

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir "${post.titulo}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/posts')
    } else {
      alert('Erro ao excluir.')
    }
  }

  return (
    <AdminLayout titulo={`Editar: ${post.titulo}`}>
      <div className="admin-header-bar">
        <h1 className="admin-page-title" style={{ fontSize: '1.4rem', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {post.titulo}
        </h1>
        <div style={{ display: 'flex', gap: '0.7rem' }}>
          <button onClick={handleDelete} style={{ background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem' }}>
            🗑 Excluir
          </button>
          <button onClick={() => handleSave(false)} className="btn-ouro" disabled={saving} style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
            💾 Salvar
          </button>
          <button onClick={() => handleSave(true)} className="btn-ler" disabled={saving}>
            🚀 {form.publicado ? 'Atualizar' : 'Publicar'}
          </button>
        </div>
      </div>

      {msg && (
        <div style={{
          background: msg.startsWith('✅') ? '#d4edda' : '#fce4e4',
          color: msg.startsWith('✅') ? '#155724' : '#c0392b',
          border: `1px solid ${msg.startsWith('✅') ? '#c3e6cb' : '#f5c6c6'}`,
          padding: '0.7rem 1rem', borderRadius: '4px', marginBottom: '1rem'
        }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div>
          <div className="admin-card">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-input"
                value={form.titulo}
                onChange={e => handleChange('titulo', e.target.value)}
                style={{ fontSize: '1.2rem' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input
                type="text"
                className="form-input"
                value={form.slug}
                readOnly
                style={{ background: 'var(--creme-dark)', color: '#888' }}
              />
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>
                /post/{form.slug}
                {' · '}
                <a href={`/post/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bordo)' }}>
                  Ver artigo →
                </a>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Resumo / Excerpt</label>
              <textarea
                className="form-textarea"
                value={form.excerpt}
                onChange={e => handleChange('excerpt', e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          <div className="admin-card">
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Conteúdo</label>
            <PostEditor value={form.conteudo} onChange={v => handleChange('conteudo', v)} />
          </div>
        </div>

        <div>
          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)', marginBottom: '1rem', fontSize: '1rem' }}>Publicação</h3>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.publicado} onChange={e => handleChange('publicado', e.target.checked)} />
                <span style={{ fontSize: '0.9rem' }}>{form.publicado ? '✅ Publicado' : '🗒 Rascunho'}</span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input type="date" className="form-input" value={form.data} onChange={e => handleChange('data', e.target.value)} />
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)', marginBottom: '1rem', fontSize: '1rem' }}>Metadados</h3>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input type="text" className="form-input" value={form.categoria} onChange={e => handleChange('categoria', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Autor</label>
              <input type="text" className="form-input" value={form.autor} onChange={e => handleChange('autor', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (separadas por vírgula)</label>
              <input type="text" className="form-input" value={form.tags} onChange={e => handleChange('tags', e.target.value)} />
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)', marginBottom: '1rem', fontSize: '1rem' }}>Imagem de Capa</h3>
            <div className="form-group">
              <label className="form-label">URL da imagem</label>
              <input type="text" className="form-input" value={form.imagem} onChange={e => handleChange('imagem', e.target.value)} placeholder="https://... ou /uploads/..." />
            </div>
            {form.imagem && (
              <img src={form.imagem} alt="Preview" style={{ width: '100%', border: '3px solid var(--moldura)', borderRadius: 'var(--raio)' }} />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } }

  const slug = ctx.params?.slug as string
  const post = getPostBySlug(slug)
  if (!post) return { notFound: true }

  return { props: { post } }
}
