import { GetServerSideProps } from 'next'
import Layout from '../components/blog/Layout'
import PostCard from '../components/blog/PostCard'
import { searchPosts, getAllPosts, PostMeta } from '../lib/posts'
import { getSettings, SiteSettings } from '../lib/settings'

interface Props {
  query: string
  resultados: PostMeta[]
  settings: SiteSettings
}

export default function BuscaPage({ query, resultados, settings }: Props) {
  return (
    <Layout settings={settings} categorias={settings.categorias || []} title={query ? `Busca: ${query}` : 'Buscar'}>
      <div style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }} className="relative">
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #d0ab58, transparent)' }} />
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: 'white' }}>
            {query ? `Resultados para "${query}"` : 'Buscar Artigos'}
          </h1>
          <form method="GET" action="/busca" className="flex overflow-hidden border-2" style={{ borderColor: 'var(--ouro)', borderRadius: '2px' }}>
            <input type="text" name="q" defaultValue={query} placeholder="Buscar artigos..."
              className="flex-1 px-4 py-3 font-serif text-base outline-none bg-white" style={{ color: 'var(--ink)' }} />
            <button type="submit" className="px-6 py-3 font-display text-xs tracking-widest uppercase font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {query && (
          <p className="font-sans text-sm mb-8" style={{ color: 'rgba(18,18,18,0.5)' }}>
            {resultados.length === 0 ? 'Nenhum resultado encontrado.' : `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'} encontrado${resultados.length !== 1 ? 's' : ''}`}
          </p>
        )}
        {resultados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map(post => (
              <PostCard key={post.slug} id={post.slug} title={post.titulo} date={post.data}
                excerpt={post.excerpt} category={post.categoria} coverImage={post.imagem}
                readingTime={post.tempoLeitura} variant="compact" />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <p className="font-serif text-lg" style={{ color: 'rgba(18,18,18,0.5)' }}>
              Tente outros termos ou navegue pelas <a href="/categorias" style={{ color: 'var(--bordo)' }}>categorias</a>.
            </p>
          </div>
        ) : null}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = (query.q as string) || ''
  const resultados = q ? searchPosts(q) : []
  const settings = getSettings()
  return { props: { query: q, resultados, settings } }
}
