import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../components/blog/Layout'
import Sidebar from '../../components/blog/Sidebar'
import PostCard from '../../components/blog/PostCard'
import { getAllPosts, getAllCategories, getPostsByCategory, PostMeta } from '../../lib/posts'
import { getSettings, SiteSettings } from '../../lib/settings'

interface Props {
  categoria: string
  posts: PostMeta[]
  recentes: PostMeta[]
  categorias: { nome: string; count: number }[]
  settings: SiteSettings
}

export default function CategoriaPage({ categoria, posts, recentes, categorias, settings }: Props) {
  return (
    <Layout settings={settings} title={`Categoria: ${categoria}`} description={`Artigos sobre ${categoria}`}>
      <div style={{ background: 'var(--grad-banner)', padding: '3rem 1.5rem', borderBottom: '3px solid var(--ouro)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ouro)', marginBottom: '0.5rem' }}>
            Categoria
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white' }}>
            {categoria}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'} publicado{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="layout-blog">
        <div>
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p style={{ color: 'var(--texto-suave)', padding: '2rem 0' }}>Nenhum artigo nesta categoria.</p>
          )}
        </div>
        <Sidebar recentes={recentes} categorias={categorias} settings={settings} />
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categorias = getAllCategories()
  return {
    paths: categorias.map(c => ({ params: { nome: c.nome } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoria = decodeURIComponent(params?.nome as string)
  const posts = getPostsByCategory(categoria)
  const allPosts = getAllPosts()
  const recentes = allPosts.slice(0, 5)
  const categorias = getAllCategories()
  const settings = getSettings()

  return {
    props: { categoria, posts, recentes, categorias, settings },
    revalidate: 60,
  }
}
