import { GetStaticProps } from 'next'
import Layout from '../components/blog/Layout'
import PostCard from '../components/blog/PostCard'
import { getAllPosts, PostMeta } from '../lib/posts'
import { getSettings, SiteSettings } from '../lib/settings'

interface Props {
  posts: PostMeta[]
  settings: SiteSettings
}

export default function Home({ posts, settings }: Props) {
  const featured = posts[0] || null
  const rest = posts.slice(1)

  return (
    <Layout settings={settings} categorias={settings.categorias || []}>

      {/* Banner hero com post em destaque */}
      {featured && (
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
          <PostCard
            id={featured.slug}
            title={featured.titulo}
            date={featured.data}
            excerpt={featured.excerpt}
            category={featured.categoria}
            coverImage={featured.imagem}
            readingTime={featured.tempoLeitura}
            featured={true}
          />
        </section>
      )}

      {/* Grid de artigos recentes */}
      {rest.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="ornamental-divider my-8">
            <span className="font-display text-xs tracking-[0.3em] uppercase font-semibold px-4"
              style={{ color: 'var(--ouro-dark)' }}>
              Artigos Recentes
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <PostCard
                key={post.slug}
                id={post.slug}
                title={post.titulo}
                date={post.data}
                excerpt={post.excerpt}
                category={post.categoria}
                coverImage={post.imagem}
                readingTime={post.tempoLeitura}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="font-display text-2xl mb-2" style={{ color: 'var(--bordo-dark)' }}>
            {settings.nome}
          </p>
          <p className="font-sans text-base" style={{ color: 'rgba(18,18,18,0.5)' }}>
            {settings.descricao}
          </p>
        </div>
      )}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts()
  const settings = getSettings()
  return { props: { posts, settings }, revalidate: 60 }
}
