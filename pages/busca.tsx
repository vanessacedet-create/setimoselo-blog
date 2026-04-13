import { GetServerSideProps } from 'next'
import Layout from '../components/blog/Layout'
import Sidebar from '../components/blog/Sidebar'
import PostCard from '../components/blog/PostCard'
import { searchPosts, getAllPosts, getAllCategories, PostMeta } from '../lib/posts'
import { getSettings, SiteSettings } from '../lib/settings'

interface Props {
  query: string
  resultados: PostMeta[]
  recentes: PostMeta[]
  categorias: { nome: string; count: number }[]
  settings: SiteSettings
}

export default function BuscaPage({ query, resultados, recentes, categorias, settings }: Props) {
  return (
    <Layout settings={settings} title={query ? `Busca: ${query}` : 'Busca'}>
      <div style={{ background: 'var(--grad-banner)', padding: '2.5rem 1.5rem', borderBottom: '3px solid var(--ouro)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'white', marginBottom: '1.2rem' }}>
            {query ? `Resultados para "${query}"` : 'Buscar Artigos'}
          </h1>
          <form method="GET" action="/busca" style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', borderRadius: 'var(--raio-md)', overflow: 'hidden', border: '2px solid var(--ouro)' }}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Digite sua busca..."
              style={{ flex: 1, padding: '0.8rem 1.2rem', border: 'none', outline: 'none', fontFamily: 'var(--font-principal)', fontSize: '1rem', background: 'rgba(255,255,255,0.95)' }}
            />
            <button type="submit" className="btn-ler" style={{ borderRadius: 0, padding: '0 1.5rem' }}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="layout-blog">
        <div>
          {query && (
            <p style={{ marginBottom: '1.5rem', color: 'var(--texto-suave)', fontSize: '0.95rem' }}>
              {resultados.length === 0
                ? 'Nenhum resultado encontrado.'
                : `${resultados.length} ${resultados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`}
            </p>
          )}
          {resultados.length > 0 ? (
            <div className="posts-grid">
              {resultados.map(post => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : query ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texto-suave)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>Tente outros termos ou navegue pelas <a href="/categorias">categorias</a>.</p>
            </div>
          ) : null}
        </div>
        <Sidebar recentes={recentes} categorias={categorias} settings={settings} />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = (query.q as string) || ''
  const resultados = q ? searchPosts(q) : []
  const allPosts = getAllPosts()
  const recentes = allPosts.slice(0, 5)
  const categorias = getAllCategories()
  const settings = getSettings()

  return { props: { query: q, resultados, recentes, categorias, settings } }
}
