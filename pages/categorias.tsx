import { GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../components/blog/Layout'
import { getAllCategories } from '../lib/posts'
import { getSettings, SiteSettings } from '../lib/settings'

interface Props {
  categorias: { nome: string; count: number }[]
  settings: SiteSettings
}

export default function CategoriasPage({ categorias, settings }: Props) {
  return (
    <Layout settings={settings} categorias={settings.categorias || []} title="Categorias">
      <div style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }} className="relative">
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #d0ab58, transparent)' }} />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'white' }}>Categorias</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {categorias.length === 0 ? (
          <p className="text-center font-serif text-lg" style={{ color: 'rgba(18,18,18,0.5)' }}>Nenhuma categoria encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map(cat => (
              <Link key={cat.nome} href={`/categoria/${encodeURIComponent(cat.nome)}`} className="group block">
                <div className="border border-gray-200 group-hover:border-bordo/40 transition-all duration-300 p-6 gold-hover"
                  style={{ background: 'var(--cream)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--parchment)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream)')}>
                  <h2 className="font-display text-xl font-semibold mb-1" style={{ color: 'var(--bordo-dark)' }}>{cat.nome}</h2>
                  <p className="font-sans text-xs" style={{ color: 'var(--ouro-dark)' }}>
                    {cat.count} {cat.count === 1 ? 'artigo' : 'artigos'}
                  </p>
                  <div className="mt-3 h-px" style={{ background: 'linear-gradient(to right, var(--ouro), transparent)' }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const categorias = getAllCategories()
  const settings = getSettings()
  return { props: { categorias, settings }, revalidate: 60 }
}
