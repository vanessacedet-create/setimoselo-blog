import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'
import PostEditor from '../../components/admin/PostEditor'
import { slugify } from '../../lib/slugify'

const btnPrimary = { background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }
const btnSecondary = { background: 'linear-gradient(135deg, #d0ab58 0%, #aa8737 100%)', color: '#621510', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }
const card = { background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc', marginBottom: '1.5rem' }

export default function NovoPost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ titulo: '', slug: '', excerpt: '', categoria: '', autor: 'Editora Sétimo Selo', data: new Date().toISOString().split('T')[0], imagem: '', tags: '', publicado: false, conteudo: '' })

  function handle(field: string, value: string | boolean) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'titulo' && !prev.slug) next.slug = slugify(value as string)
      return next
    })
  }

  async function save(publicar?: boolean) {
    if (!form.titulo.trim()) { setMsg('⚠ Título obrigatório.'); return }
    setSaving(true); setMsg('')
    const res = await fetch('/api/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, publicado: publicar !== undefined ? publicar : form.publicado, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), slug: slugify(form.slug || form.titulo) }),
    })
    setSaving(false)
    if (res.ok) { const d = await res.json(); router.push(`/admin/editar/${d.slug}`) }
    else { const e = await res.json(); setMsg('Erro: ' + (e.error || 'desconhecido')) }
  }

  return (
    <AdminLayout titulo="Novo Artigo">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--bordo-dark)' }}>Novo Artigo</h1>
        <div style={{ display: 'flex', gap: '0.7rem' }}>
          <button onClick={() => save(false)} style={btnSecondary} disabled={saving}>💾 Rascunho</button>
          <button onClick={() => save(true)} style={btnPrimary} disabled={saving}>🚀 Publicar</button>
        </div>
      </div>

      {msg && <div style={{ background: '#fce4e4', color: '#c0392b', border: '1px solid #f5c6c6', padding: '0.7rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div>
          <div style={card}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Título *</label>
              <input className="form-input" style={{ fontSize: '1.2rem' }} value={form.titulo} onChange={e => handle('titulo', e.target.value)} placeholder="Título do artigo" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={form.slug} onChange={e => handle('slug', e.target.value)} placeholder="slug-do-artigo" />
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>/post/{form.slug || 'slug'}</p>
            </div>
            <div>
              <label className="form-label">Resumo (Excerpt)</label>
              <textarea className="form-textarea" style={{ minHeight: '80px' }} value={form.excerpt} onChange={e => handle('excerpt', e.target.value)} placeholder="Breve resumo..." />
            </div>
          </div>
          <div style={card}>
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Conteúdo</label>
            <PostEditor value={form.conteudo} onChange={v => handle('conteudo', v)} />
          </div>
        </div>

        <div>
          <div style={card}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1rem' }}>Publicação</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.publicado} onChange={e => handle('publicado', e.target.checked)} />
              <span style={{ fontSize: '0.9rem' }}>{form.publicado ? '✅ Publicado' : '🗒 Rascunho'}</span>
            </label>
            <label className="form-label">Data</label>
            <input type="date" className="form-input" value={form.data} onChange={e => handle('data', e.target.value)} />
          </div>
          <div style={card}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1rem' }}>Metadados</h3>
            {[
              { label: 'Categoria', field: 'categoria', placeholder: 'Literatura' },
              { label: 'Autor', field: 'autor', placeholder: 'Editora Sétimo Selo' },
              { label: 'Tags (vírgula)', field: 'tags', placeholder: 'clássicos, poesia' },
            ].map(({ label, field, placeholder }) => (
              <div key={field} style={{ marginBottom: '0.8rem' }}>
                <label className="form-label">{label}</label>
                <input className="form-input" value={(form as Record<string,string>)[field]} onChange={e => handle(field, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
          <div style={card}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1rem' }}>Imagem de Capa</h3>
            <label className="form-label">URL ou caminho</label>
            <input className="form-input" value={form.imagem} onChange={e => handle('imagem', e.target.value)} placeholder="/images/nome.jpg" />
            <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.3rem' }}>Coloque a imagem em public/images/ no GitHub</p>
            {form.imagem && <img src={form.imagem} alt="Preview" style={{ width: '100%', marginTop: '0.8rem', border: '3px solid var(--moldura)', borderRadius: '3px' }} />}
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
