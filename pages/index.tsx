import { GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../components/blog/Layout'
import Sidebar from '../components/blog/Sidebar'
import PostCard from '../components/blog/PostCard'
import { getAllPosts, getAllCategories, PostMeta } from '../lib/posts'
import { getSettings, SiteSettings } from '../lib/settings'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  posts: PostMeta[]
  recentes: PostMeta[]
  categorias: { nome: string; count: number }[]
  settings: SiteSettings
  destaque: PostMeta | null
}

export default function Home({ posts, recentes, categorias, settings, destaque }: Props) {
  const restantes = destaque ? posts.filter(p => p.slug !== destaque.slug) : posts

  return (
    <Layout settings={settings}>
      {/* Hero com post em destaque */}
      {destaque ? (
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-subtitle">
              <span style={{ color: 'var(--ouro)' }}>✦</span> {destaque.categoria} <span style={{ color: 'var(--ouro)' }}>✦</span>
            </div>
            <h1 className="hero-title">{destaque.titulo}</h1>
            <p className="hero-excerpt">{destaque.excerpt}</p>
            <div className="hero-meta">
              {destaque.data && (
                <span>
                  📅 {format(new Date(destaque.data + 'T00:00:00'), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              )}
              <span>⏱ {destaque.tempoLeitura} min de leitura</span>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link href={`/post/${destaque.slug}`} className="btn-ouro">
                Ler Artigo Completo →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-subtitle">
              <span style={{ color: 'var(--ouro)' }}>✦</span> Literatura & Espiritualidade <span style={{ color: 'var(--ouro)' }}>✦</span>
            </div>
            <h1 className="hero-title">{settings.nome}</h1>
            <p className="hero-excerpt">{settings.descricao}</p>
          </div>
        </div>
      )}

      {/* Grid de posts */}
      <div className="layout-blog">
        <div>
          {restantes.length > 0 ? (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--bordo-deep)', fontFamily: 'var(--font-display)' }}>
                  Artigos Recentes
                </h2>
                <div className="divisor-ouro" />
              </div>
              <div className="posts-grid">
                {restantes.map(post => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--texto-suave)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
              <p>Nenhum artigo publicado ainda.</p>
            </div>
          )}
        </div>

        <Sidebar recentes={recentes} categorias={categorias} settings={settings} />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts()
  const categorias = getAllCategories()
  const settings = getSettings()
  const destaque = posts[0] || null
  const recentes = posts.slice(0, 5)

  return {
    props: { posts, recentes, categorias, settings, destaque },
    revalidate: 60,
  }
}
