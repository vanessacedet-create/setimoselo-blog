import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/admin/AdminLayout'
import PostEditor from '../../../components/admin/PostEditor'
import { getPostBySlug, Post } from '../../../lib/posts'

const btnPrimary = { background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }
const btnSecondary = { background: 'linear-gradient(135deg, #d0ab58 0%, #aa8737 100%)', color: '#621510', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }
const card = { background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc', marginBottom: '1.5rem' }

interface Props { post: Post }

export default function EditarPost({ post }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    titulo: post.titulo, excerpt: post.excerpt, categoria: post.categoria,
    autor: post.autor, data: post.data, imagem: post.imagem,
    tags: post.tags.join(', '), publicado: post.publicado, conteudo: post.conteudo,
  })

  function handle(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function save(publicar?: boolean) {
    setSaving(true); setMsg('')
    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, publicado: publicar !== undefined ? publicar : form.publicado, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
    })
    setSaving(false)
    if (res.ok) { setMsg('✅ Salvo com sucesso!'); setTimeout(() => setMsg(''), 3000) }
    else { const e = await res.json(); setMsg('Erro: ' + (e.error || 'desconhecido')) }
  }

  async function handleDelete() {
    if (!confirm(`Excluir "${post.titulo}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/posts')
    else alert('Erro ao excluir.')
  }

  return (
    <AdminLayout titulo={`Editar: ${post.titulo}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--bordo-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
          {post.titulo}
        </h1>
        <div style={{ display: 'flex', gap: '0.7rem', flexShrink: 0 }}>
          <button onClick={handleDelete} style={{ background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.4rem 0.8rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.82rem' }}>🗑 Excluir</button>
          <button onClick={() => save(false)} style={btnSecondary} disabled={saving}>💾 Salvar</button>
          <button onClick={() => save(true)} style={btnPrimary} disabled={saving}>🚀 {form.publicado ? 'Atualizar' : 'Publicar'}</button>
        </div>
      </div>

      {msg && <div style={{ background: msg.startsWith('✅') ? '#d4edda' : '#fce4e4', color: msg.startsWith('✅') ? '#155724' : '#c0392b', border: `1px solid ${msg.startsWith('✅') ? '#c3e6cb' : '#f5c6c6'}`, padding: '0.7rem 1rem', borderRadius: '4px', marginBottom: '1rem' }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div>
          <div style={card}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Título</label>
              <input className="form-input" style={{ fontSize: '1.2rem' }} value={form.titulo} onChange={e => handle('titulo', e.target.value)} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={post.slug} readOnly style={{ background: '#f5ede0', color: '#888' }} />
              <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.3rem' }}>
                /post/{post.slug} · <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bordo)' }}>Ver artigo →</a>
              </p>
            </div>
            <div>
              <label className="form-label">Resumo</label>
              <textarea className="form-textarea" style={{ minHeight: '80px' }} value={form.excerpt} onChange={e => handle('excerpt', e.target.value)} />
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
  const slug = ctx.params?.slug as string
  const post = getPostBySlug(slug)
  if (!post) return { notFound: true }
  return { props: { post } }
}
