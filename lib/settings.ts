import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'content/settings/site.json')

export interface SiteSettings {
  nome: string
  descricao: string
  logo: string
  favicon: string
  instagram: string
  facebook: string
  youtube: string
  twitter: string
  tiktok: string
  whatsapp: string
  email: string
  storeUrl: string
  googleAnalytics: string
  rodape: string
  categorias: { id: string; slug: string; label: string }[]
}

const defaultSettings: SiteSettings = {
  nome: 'Blog Editora Sétimo Selo',
  descricao: 'Literatura, espiritualidade e pensamento clássico',
  logo: '/images/logo.png',
  favicon: '/images/logo.png',
  instagram: '',
  facebook: '',
  youtube: '',
  twitter: '',
  tiktok: '',
  whatsapp: '',
  email: '',
  storeUrl: 'https://editorasetimoselo.com.br',
  googleAnalytics: '',
  rodape: '© Editora Sétimo Selo. Todos os direitos reservados.',
  categorias: [],
}

export function getSettings(): SiteSettings {
  try {
    if (!fs.existsSync(settingsPath)) return defaultSettings
    const raw = fs.readFileSync(settingsPath, 'utf8')
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: Partial<SiteSettings>): void {
  const dir = path.dirname(settingsPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const current = getSettings()
  const updated = { ...current, ...settings }
  fs.writeFileSync(settingsPath, JSON.stringify(updated, null, 2), 'utf8')
}
