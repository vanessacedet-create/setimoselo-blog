import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getSettings, SiteSettings } from '../../lib/settings'

interface Props {
  settings: SiteSettings
}

export default function Configuracoes({ settings: initial }: Props) {
  const [form, setForm] = useState<SiteSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  function handleChange(field: keyof SiteSettings, value: string) {
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
    if (res.ok) {
      setMsg('✅ Configurações salvas com sucesso!')
      setTimeout(() => setMsg(''), 4000)
    } else {
      setMsg('Erro ao salvar configurações.')
    }
  }

  async function handleLogoUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      setUploadingLogo(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      setUploadingLogo(false)
      if (data.url) {
        handleChange('logo', data.url)
      } else {
        alert('Erro no upload.')
      }
    }
    input.click()
  }

  const Section = ({ title }: { title: string }) => (
    <h3 style={{
      fontFamily: 'var(--font-display)', color: 'var(--bordo-deep)',
      fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--borda)',
    }}>
      {title}
    </h3>
  )

  return (
    <AdminLayout titulo="Configurações">
      <div className="admin-header-bar">
        <h1 className="admin-page-title">Configurações do Site</h1>
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

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Identidade */}
          <div className="admin-card">
            <Section title="🏷 Identidade do Blog" />
            <div className="form-group">
              <label className="form-label">Nome do Blog</label>
              <input type="text" className="form-input" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea className="form-textarea" value={form.descricao} onChange={e => handleChange('descricao', e.target.value)} style={{ minHeight: '80px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Texto do Rodapé</label>
              <input type="text" className="form-input" value={form.rodape} onChange={e => handleChange('rodape', e.target.value)} />
            </div>
          </div>

          {/* Logo */}
          <div className="admin-card">
            <Section title="🖼 Logo" />
            <div className="form-group">
              <label className="form-label">URL do Logo</label>
              <input type="text" className="form-input" value={form.logo} onChange={e => handleChange('logo', e.target.value)} placeholder="/images/logo.png" />
            </div>
            <button type="button" className="btn-ouro" onClick={handleLogoUpload} disabled={uploadingLogo} style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              {uploadingLogo ? '⏳ Enviando...' : '📤 Upload do Logo'}
            </button>
            {form.logo && (
              <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--creme-dark)', borderRadius: 'var(--raio)' }}>
                <img src={form.logo} alt="Logo preview" style={{ maxHeight: '80px', maxWidth: '100%' }} />
              </div>
            )}
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Favicon (URL)</label>
              <input type="text" className="form-input" value={form.favicon} onChange={e => handleChange('favicon', e.target.value)} placeholder="/favicon.ico" />
            </div>
          </div>

          {/* Redes sociais */}
          <div className="admin-card">
            <Section title="📱 Redes Sociais" />
            {[
              { label: 'Instagram', field: 'instagram', placeholder: 'https://instagram.com/setimoselo' },
              { label: 'Facebook', field: 'facebook', placeholder: 'https://facebook.com/setimoselo' },
              { label: 'YouTube', field: 'youtube', placeholder: 'https://youtube.com/@setimoselo' },
              { label: 'WhatsApp (só números)', field: 'whatsapp', placeholder: '5519999999999' },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  type="text"
                  className="form-input"
                  value={(form as unknown as Record<string, string>)[field]}
                  onChange={e => handleChange(field as keyof SiteSettings, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Integrações */}
          <div className="admin-card">
            <Section title="🔗 Integrações" />
            <div className="form-group">
              <label className="form-label">Link da Loja</label>
              <input type="text" className="form-input" value={form.linkLoja} onChange={e => handleChange('linkLoja', e.target.value)} placeholder="https://editorasetimoselo.com.br" />
            </div>
            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input type="text" className="form-input" value={form.googleAnalytics} onChange={e => handleChange('googleAnalytics', e.target.value)} placeholder="G-XXXXXXXXXX" />
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>
                Encontre em: Google Analytics → Admin → Fluxos de dados → ID de medição
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <button type="submit" className="btn-ler" disabled={saving} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            {saving ? 'Salvando...' : '💾 Salvar Todas as Configurações'}
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
