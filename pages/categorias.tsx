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
    <Layout settings={settings} title="Categorias">
      <div style={{ background: 'var(--grad-banner)', padding: '3rem 1.5rem', borderBottom: '3px solid var(--ouro)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ouro)', marginBottom: '0.5rem' }}>
            Navegação
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white' }}>
            Categorias
          </h1>
        </div>
      </div>

      <div className="container" style={{ margin: '3rem auto', maxWidth: '800px' }}>
        {categorias.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--texto-suave)', padding: '3rem' }}>
            Nenhuma categoria encontrada.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
            {categorias.map(cat => (
              <Link
                key={cat.nome}
                href={`/categoria/${encodeURIComponent(cat.nome)}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  border: '1px solid var(--borda)',
                  borderRadius: 'var(--raio-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px var(--sombra)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = ''
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--bordo-deep)', fontWeight: 600 }}>
                    {cat.nome}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ouro-dark)', fontWeight: 600 }}>
                    {cat.count} {cat.count === 1 ? 'artigo' : 'artigos'}
                  </div>
                  <div style={{ marginTop: '0.5rem', height: '2px', background: 'var(--grad-ouro)', borderRadius: '1px' }} />
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
