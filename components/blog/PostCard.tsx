import React from 'react'
import Link from 'next/link'
import { PostMeta } from '../../lib/posts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  post: PostMeta
}

export default function PostCard({ post }: Props) {
  const dataFormatada = post.data
    ? format(new Date(post.data + 'T00:00:00'), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : ''

  return (
    <article className="post-card">
      <div className="post-card-img">
        <Link href={`/post/${post.slug}`}>
          {post.imagem ? (
            <img src={post.imagem} alt={post.titulo} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, var(--bordo) 0%, var(--bordo-deep) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '180px',
            }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>📖</span>
            </div>
          )}
        </Link>
      </div>
      <div className="post-card-body">
        <Link href={`/categoria/${encodeURIComponent(post.categoria)}`} className="post-categoria">
          {post.categoria}
        </Link>
        <h2 className="post-card-title">
          <Link href={`/post/${post.slug}`}>{post.titulo}</Link>
        </h2>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-footer">
          <div>
            <div style={{ marginBottom: '0.1rem' }}>{dataFormatada}</div>
            <div className="leitura">⏱ {post.tempoLeitura} min de leitura</div>
          </div>
          <Link href={`/post/${post.slug}`} className="btn-ler">
            Ler →
          </Link>
        </div>
      </div>
    </article>
  )
}
