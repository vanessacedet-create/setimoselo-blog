import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../../components/blog/Layout'
import PostCard from '../../components/blog/PostCard'
import { getPostSlugs, getPostBySlugWithHtml, getAllPosts, getRelatedPosts, Post, PostMeta } from '../../lib/posts'
import { getSettings, SiteSettings } from '../../lib/settings'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  post: Post
  relacionados: PostMeta[]
  settings: SiteSettings
}

export default function PostPage({ post, relacionados, settings }: Props) {
  const formattedDate = post.data
    ? format(parseISO(post.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  return (
    <Layout
      settings={settings}
      categorias={settings.categorias || []}
      title={post.titulo}
      description={post.excerpt}
      ogImage={post.imagem}
    >
      {/* Header do artigo */}
      <div style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }} className="relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #d0ab58, transparent)' }} />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          {post.categoria && (
            <Link href={`/categoria/${post.categoria}`}>
              <span className="inline-block font-display text-xs tracking-[0.3em] uppercase font-semibold mb-4 border px-3 py-1"
                style={{ color: 'var(--ouro)', borderColor: 'rgba(208,171,88,0.4)' }}>
                {post.categoria}
              </span>
            </Link>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6" style={{ color: 'white' }}>
            {post.titulo}
          </h1>
          {post.excerpt && (
            <p className="font-serif text-lg leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-sans text-sm" style={{ color: 'rgba(208,171,88,0.8)' }}>{post.autor}</span>
            <span style={{ color: 'rgba(208,171,88,0.4)' }}>·</span>
            <span className="font-sans text-sm" style={{ color: 'rgba(208,171,88,0.8)' }}>{formattedDate}</span>
            {post.tempoLeitura && (
              <>
                <span style={{ color: 'rgba(208,171,88,0.4)' }}>·</span>
                <span className="font-sans text-sm" style={{ color: 'rgba(208,171,88,0.8)' }}>{post.tempoLeitura} min de leitura</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Imagem de capa */}
      {post.imagem && (
        <div className="max-w-4xl mx-auto px-6 -mt-6 mb-0 relative z-10">
          <div className="frame-moldura overflow-hidden shadow-xl">
            <img src={post.imagem} alt={post.titulo} className="w-full h-64 md:h-96 object-cover" />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div
          className="prose-setimoselo"
          dangerouslySetInnerHTML={{ __html: post.conteudoHtml }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2 items-center">
            <span className="font-sans text-xs uppercase tracking-widest font-semibold mr-2" style={{ color: 'rgba(18,18,18,0.4)' }}>Tags:</span>
            {post.tags.map(tag => (
              <span key={tag}
                className="font-sans text-xs border px-3 py-1"
                style={{ color: 'var(--bordo)', borderColor: 'rgba(122,34,30,0.25)', background: 'var(--parchment)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Artigos relacionados */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="ornamental-divider my-8">
            <span className="font-display text-xs tracking-[0.3em] uppercase font-semibold px-4"
              style={{ color: 'var(--ouro-dark)' }}>
              Artigos Relacionados
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relacionados.map(p => (
              <PostCard key={p.slug} id={p.slug} title={p.titulo} date={p.data}
                excerpt={p.excerpt} category={p.categoria} coverImage={p.imagem}
                readingTime={p.tempoLeitura} variant="related" />
            ))}
          </div>
        </section>
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getPostSlugs()
  return { paths: slugs.map(slug => ({ params: { slug } })), fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPostBySlugWithHtml(slug)
  if (!post || !post.publicado) return { notFound: true }
  const relacionados = getRelatedPosts(slug)
  const settings = getSettings()
  return { props: { post, relacionados, settings }, revalidate: 60 }
}
