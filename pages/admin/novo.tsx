import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'
import PostEditor from '../../components/admin/PostEditor'
import { slugify } from '../../lib/slugify'

export default function NovoPost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [form, setForm] = useState({
    titulo: '',
    slug: '',
    excerpt: '',
    categoria: '',
    autor: 'Editora Sétimo Selo',
    data: new Date().toISOString().split('T')[0],
    imagem: '',
    tags: '',
    publicado: false,
    conteudo: '',
  })

  function handleChange(field: string, value: string | boolean) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'titulo' && !prev.slug) {
        next.slug = slugify(value as string)
      }
      return next
    })
  }

  async function handleSave(publicar?: boolean) {
    if (!form.titulo.trim()) { setMsg('⚠ O título é obrigatório.'); return }
    if (!form.slug.trim()) { setMsg('⚠ O slug é obrigatório.'); return }

    setSaving(true)
    setMsg('')

    const payload = {
      ...form,
      publicado: publicar !== undefined ? publicar : form.publicado,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      slug: slugify(form.slug),
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (res.ok) {
      router.push(`/admin/editar/${payload.slug}`)
    } else {
      const err = await res.json()
      setMsg('Erro: ' + (err.error || 'desconhecido'))
    }
  }

  return (
    <AdminLayout titulo="Novo Artigo">
      <div className="admin-header-bar">
        <h1 className="admin-page-title">Novo Artigo</h1>
        <div style={{ display: 'flex', gap: '0.7rem' }}>
          <button onClick={() => handleSave(false)} className="btn-ouro" disabled={saving} style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
            💾 Salvar Rascunho
          </button>
          <button onClick={() => handleSave(true)} className="btn-ler" disabled={saving}>
            🚀 Publicar
          </button>
        </div>
      </div>

      {msg && <div className={msg.startsWith('⚠') || msg.startsWith('Erro') ? 'error-msg' : 'error-msg'} style={{ background: msg.startsWith('⚠') || msg.startsWith('Erro') ? '#fce4e4' : '#d4edda', color: msg.startsWith('⚠') || msg.startsWith('Erro') ? '#c0392b' : '#155724', borderColor: msg.startsWith('⚠') || msg.startsWith('Erro') ? '#f5c6c6' : '#c3e6cb', padding: '0.7rem 1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Coluna principal */}
        <div>
          <div className="admin-card">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-input"
                value={form.titulo}
                onChange={e => handleChange('titulo', e.target.value)}
                placeholder="Título do artigo"
                style={{ fontSize: '1.2rem' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL) *</label>
              <input
                type="text"
                className="form-input"
                value={form.slug}
                onChange={e => handleChange('slug', e.target.value)}
                placeholder="titulo-do-artigo"
              />
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>
                URL: /post/{form.slug || 'slug-do-artigo'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Resumo / Excerpt</label>
              <textarea
                className="form-textarea"
                value={form.excerpt}
                onChange={e => handleChange('excerpt', e.target.value)}
                placeholder="Breve resumo do artigo (aparece nos cards e na busca)"
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          <div className="admin-card">
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Conteúdo</label>
            <PostEditor value={form.conteudo} onChange={v => handleChange('conteudo', v)} />
          </div>
        </div>

        {/* Sidebar de metadados */}
        <div>
          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)', marginBottom: '1rem', fontSize: '1rem' }}>
              Publicação
            </h3>
            <div className="form-group">
              <label className="form-label">Status</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.publicado}
                  onChange={e => handleChange('publicado', e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem' }}>{form.publicado ? '✅ Publicado' : '🗒 Rascunho'}</span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-input"
                value={form.data}
                onChange={e => handleChange('data', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)', marginBottom: '1rem', fontSize: '1rem' }}>
              Metadados
            </h3>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input
                type="text"
                className="form-input"
                value={form.categoria}
                onChange={e => handleChange('categoria', e.target.value)}
                placeholder="ex: Literatura, Espiritualidade"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Autor</label>
              <input
                type="text"
                className="form-input"
                value={form.autor}
                onChange={e => handleChange('autor', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (separadas por vírgula)</label>
              <input
                type="text"
                className="form-input"
                value={form.tags}
                onChange={e => handleChange('tags', e.target.value)}
                placeholder="literatura, clássicos, poesia"
              />
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)', marginBottom: '1rem', fontSize: '1rem' }}>
              Imagem de Capa
            </h3>
            <div className="form-group">
              <label className="form-label">URL da imagem</label>
              <input
                type="text"
                className="form-input"
                value={form.imagem}
                onChange={e => handleChange('imagem', e.target.value)}
                placeholder="https://... ou /uploads/..."
              />
            </div>
            {form.imagem && (
              <img
                src={form.imagem}
                alt="Preview"
                style={{ width: '100%', border: '3px solid var(--moldura)', borderRadius: 'var(--raio)' }}
              />
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
  return { props: {} }
}
