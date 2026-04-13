import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../../components/blog/Layout'
import Sidebar from '../../components/blog/Sidebar'
import PostCard from '../../components/blog/PostCard'
import {
  getPostSlugs, getPostBySlugWithHtml, getAllPosts,
  getAllCategories, getRelatedPosts, Post, PostMeta
} from '../../lib/posts'
import { getSettings, SiteSettings } from '../../lib/settings'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  post: Post
  recentes: PostMeta[]
  categorias: { nome: string; count: number }[]
  relacionados: PostMeta[]
  settings: SiteSettings
}

export default function PostPage({ post, recentes, categorias, relacionados, settings }: Props) {
  const dataFormatada = post.data
    ? format(new Date(post.data + 'T00:00:00'), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  return (
    <Layout
      settings={settings}
      title={post.titulo}
      description={post.excerpt}
      ogImage={post.imagem}
    >
      {/* Header do artigo */}
      <div className="article-header">
        <div className="container">
          <div className="article-header-subtitle">
            <Link href={`/categoria/${encodeURIComponent(post.categoria)}`} style={{ color: 'var(--ouro)' }}>
              {post.categoria}
            </Link>
          </div>
          <h1 className="article-header-title">{post.titulo}</h1>
          <div className="article-header-meta">
            <span>✍ {post.autor}</span>
            {post.data && <span>📅 {dataFormatada}</span>}
            <span>⏱ {post.tempoLeitura} min de leitura</span>
          </div>
        </div>
      </div>

      {/* Conteúdo + Sidebar */}
      <div className="layout-blog">
        <article>
          {post.imagem && (
            <div className="article-imagem-destaque">
              <img src={post.imagem} alt={post.titulo} />
            </div>
          )}

          {post.excerpt && (
            <p style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: 'var(--bordo)',
              borderLeft: '4px solid var(--ouro)',
              paddingLeft: '1.5rem',
              marginBottom: '2rem',
              lineHeight: 1.7,
            }}>
              {post.excerpt}
            </p>
          )}

          <div
            className="article-corpo"
            dangerouslySetInnerHTML={{ __html: post.conteudoHtml }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--borda)' }}>
              <span style={{ fontSize: '0.85rem', color: '#999', marginRight: '0.8rem' }}>Tags:</span>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-block',
                  background: 'var(--creme-dark)',
                  color: 'var(--bordo)',
                  border: '1px solid var(--moldura-dark)',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '1rem',
                  fontSize: '0.8rem',
                  marginRight: '0.4rem',
                  marginBottom: '0.4rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Artigos relacionados */}
          {relacionados.length > 0 && (
            <div className="relacionados">
              <h2 className="relacionados-titulo">Artigos Relacionados</h2>
              <div className="divisor-ouro" style={{ marginBottom: '1.5rem' }} />
              <div className="posts-grid">
                {relacionados.map(p => <PostCard key={p.slug} post={p} />)}
              </div>
            </div>
          )}
        </article>

        <Sidebar recentes={recentes} categorias={categorias} settings={settings} />
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPostSlugs()
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPostBySlugWithHtml(slug)
  if (!post || !post.publicado) return { notFound: true }

  const posts = getAllPosts()
  const recentes = posts.slice(0, 5)
  const categorias = getAllCategories()
  const relacionados = getRelatedPosts(slug)
  const settings = getSettings()

  return {
    props: { post, recentes, categorias, relacionados, settings },
    revalidate: 60,
  }
}
