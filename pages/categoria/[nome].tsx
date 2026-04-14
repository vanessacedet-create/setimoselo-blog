import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../components/blog/Layout'
import PostCard from '../../components/blog/PostCard'
import { getAllPosts, getPostsByCategory, getAllCategories, PostMeta } from '../../lib/posts'
import { getSettings, SiteSettings } from '../../lib/settings'

interface Props {
  categoria: string
  posts: PostMeta[]
  settings: SiteSettings
}

export default function CategoriaPage({ categoria, posts, settings }: Props) {
  return (
    <Layout settings={settings} categorias={settings.categorias || []} title={categoria}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }} className="relative">
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #d0ab58, transparent)' }} />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p className="font-display text-xs tracking-[0.3em] uppercase font-semibold mb-3" style={{ color: 'var(--ouro)' }}>
            Categoria
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'white' }}>{categoria}</h1>
          <p className="font-sans text-sm mt-3" style={{ color: 'rgba(208,171,88,0.7)' }}>
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post.slug} id={post.slug} title={post.titulo} date={post.data}
                excerpt={post.excerpt} category={post.categoria} coverImage={post.imagem}
                readingTime={post.tempoLeitura} variant="compact" />
            ))}
          </div>
        ) : (
          <p className="text-center font-serif text-lg py-16" style={{ color: 'rgba(18,18,18,0.5)' }}>
            Nenhum artigo nesta categoria ainda.
          </p>
        )}
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const cats = getAllCategories()
  return { paths: cats.map(c => ({ params: { nome: c.nome } })), fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoria = decodeURIComponent(params?.nome as string)
  const posts = getPostsByCategory(categoria)
  const settings = getSettings()
  return { props: { categoria, posts, settings }, revalidate: 60 }
}
