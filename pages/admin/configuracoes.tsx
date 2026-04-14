import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getSettings, SiteSettings } from '../../lib/settings'

interface Props { settings: SiteSettings }

export default function Configuracoes({ settings: initial }: Props) {
  const [form, setForm] = useState<SiteSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  function set(field: keyof SiteSettings, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setMsg(res.ok ? '✅ Configurações salvas!' : 'Erro ao salvar.')
    setTimeout(() => setMsg(''), 4000)
  }

  async function handleLogoUpload() {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return
      setUploadingLogo(true)
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setUploadingLogo(false)
      if (data.url) set('logo', data.url)
      else alert('Erro no upload.')
    }
    input.click()
  }

  // Campos de redes sociais tipados explicitamente
  const socialFields: { label: string; field: keyof SiteSettings; placeholder: string }[] = [
    { label: 'Instagram', field: 'instagram', placeholder: 'https://instagram.com/setimoselo' },
    { label: 'Facebook',  field: 'facebook',  placeholder: 'https://facebook.com/setimoselo' },
    { label: 'YouTube',   field: 'youtube',   placeholder: 'https://youtube.com/@setimoselo' },
    { label: 'X / Twitter', field: 'twitter', placeholder: 'https://twitter.com/setimoselo' },
    { label: 'TikTok',    field: 'tiktok',    placeholder: 'https://tiktok.com/@setimoselo' },
    { label: 'WhatsApp (só números)', field: 'whatsapp', placeholder: '5519999999999' },
    { label: 'E-mail',    field: 'email',     placeholder: 'contato@editorasetimoselo.com.br' },
  ]

  return (
    <AdminLayout titulo="Configurações">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'var(--bordo-dark)' }}>Configurações</h1>
      </div>

      {msg && (
        <div style={{
          background: msg.startsWith('✅') ? '#d4edda' : '#fce4e4',
          color: msg.startsWith('✅') ? '#155724' : '#c0392b',
          border: `1px solid ${msg.startsWith('✅') ? '#c3e6cb' : '#f5c6c6'}`,
          padding: '0.7rem 1rem', borderRadius: '4px', marginBottom: '1rem'
        }}>{msg}</div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Identidade */}
          <div style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc' }}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid #e0d8cc', paddingBottom: '0.5rem' }}>
              🏷 Identidade
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Nome do Blog</label>
              <input className="form-input" value={form.nome} onChange={e => set('nome', e.target.value)} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Descrição</label>
              <textarea className="form-textarea" value={form.descricao} onChange={e => set('descricao', e.target.value)} style={{ minHeight: '80px' }} />
            </div>
            <div>
              <label className="form-label">Texto do Rodapé</label>
              <input className="form-input" value={form.rodape} onChange={e => set('rodape', e.target.value)} />
            </div>
          </div>

          {/* Logo */}
          <div style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc' }}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid #e0d8cc', paddingBottom: '0.5rem' }}>
              🖼 Logo
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">URL do Logo</label>
              <input className="form-input" value={form.logo} onChange={e => set('logo', e.target.value)} placeholder="/images/logo.png" />
            </div>
            <button type="button" onClick={handleLogoUpload} disabled={uploadingLogo}
              style={{ background: 'linear-gradient(135deg, #d0ab58 0%, #aa8737 100%)', color: '#621510', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
              {uploadingLogo ? '⏳ Enviando...' : '📤 Upload do Logo'}
            </button>
            {form.logo && (
              <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--parchment)', borderRadius: '3px' }}>
                <img src={form.logo} alt="Preview" style={{ maxHeight: '70px', maxWidth: '100%' }} />
              </div>
            )}
          </div>

          {/* Redes sociais */}
          <div style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc' }}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid #e0d8cc', paddingBottom: '0.5rem' }}>
              📱 Redes Sociais & Contato
            </h3>
            {socialFields.map(({ label, field, placeholder }) => (
              <div key={field} style={{ marginBottom: '0.8rem' }}>
                <label className="form-label">{label}</label>
                <input className="form-input"
                  value={(form[field] as string) || ''}
                  onChange={e => set(field, e.target.value)}
                  placeholder={placeholder} />
              </div>
            ))}
          </div>

          {/* Integrações */}
          <div style={{ background: 'white', borderRadius: '6px', padding: '1.5rem', border: '1px solid #e0d8cc' }}>
            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid #e0d8cc', paddingBottom: '0.5rem' }}>
              🔗 Integrações
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Link da Loja</label>
              <input className="form-input" value={form.storeUrl} onChange={e => set('storeUrl', e.target.value)} placeholder="https://editorasetimoselo.com.br" />
            </div>
            <div>
              <label className="form-label">Google Analytics ID</label>
              <input className="form-input" value={form.googleAnalytics} onChange={e => set('googleAnalytics', e.target.value)} placeholder="G-XXXXXXXXXX" />
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>
                Google Analytics → Admin → Fluxos de dados → ID de medição
              </p>
            </div>

            <h3 style={{ fontFamily: 'Cormorant, serif', color: 'var(--bordo-dark)', margin: '1.5rem 0 1rem', fontSize: '1.1rem', borderBottom: '1px solid #e0d8cc', paddingBottom: '0.5rem' }}>
              📂 Categorias do Menu
            </h3>
            <div style={{ marginBottom: '0.5rem' }}>
              {(form.categorias || []).map((cat, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className="form-input" value={cat.label}
                    onChange={e => {
                      const cats = [...(form.categorias || [])]
                      cats[i] = { ...cats[i], label: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-') }
                      set('categorias', cats)
                    }}
                    placeholder="Nome da categoria" style={{ flex: 1 }} />
                  <button type="button"
                    onClick={() => set('categorias', (form.categorias || []).filter((_, j) => j !== i))}
                    style={{ background: 'none', border: '1px solid #f5c6c6', color: '#c0392b', padding: '0.4rem 0.7rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button"
                onClick={() => set('categorias', [...(form.categorias || []), { id: Date.now().toString(), slug: '', label: '' }])}
                style={{ background: 'none', border: '1px dashed #e0d8cc', color: 'var(--bordo)', padding: '0.4rem 1rem', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem', width: '100%', marginTop: '0.3rem' }}>
                + Adicionar categoria
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving}
            style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)', color: 'white', border: 'none', padding: '0.8rem 2.5rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em' }}>
            {saving ? 'Salvando...' : '💾 Salvar Configurações'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } }
  const settings = getSettings()
  return { props: { settings } }
}
