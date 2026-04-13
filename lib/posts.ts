import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'

const postsDir = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  titulo: string
  excerpt: string
  data: string
  autor: string
  categoria: string
  imagem: string
  tags: string[]
  publicado: boolean
  tempoLeitura: number
}

export interface Post extends PostMeta {
  conteudo: string
  conteudoHtml: string
}

function calcularTempoLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).length
  return Math.ceil(palavras / 200)
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDir, `${slug}.md`)
    if (!fs.existsSync(fullPath)) return null
    const raw = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(raw)
    return {
      slug,
      titulo: data.titulo || '',
      excerpt: data.excerpt || '',
      data: data.data || '',
      autor: data.autor || 'Editora Sétimo Selo',
      categoria: data.categoria || 'Geral',
      imagem: data.imagem || '',
      tags: data.tags || [],
      publicado: data.publicado !== false,
      tempoLeitura: calcularTempoLeitura(content),
      conteudo: content,
      conteudoHtml: '',
    }
  } catch {
    return null
  }
}

export async function getPostBySlugWithHtml(slug: string): Promise<Post | null> {
  const post = getPostBySlug(slug)
  if (!post) return null
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(post.conteudo)
  post.conteudoHtml = processed.toString()
  return post
}

export function getAllPosts(apenasPublicados = true): PostMeta[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter(Boolean) as Post[]

  return posts
    .filter(p => !apenasPublicados || p.publicado)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

export function getPostsByCategory(categoria: string): PostMeta[] {
  return getAllPosts().filter(p => p.categoria === categoria)
}

export function searchPosts(query: string): PostMeta[] {
  const q = query.toLowerCase()
  return getAllPosts().filter(p =>
    p.titulo.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.categoria.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  )
}

export function getAllCategories(): { nome: string; count: number }[] {
  const posts = getAllPosts()
  const map: Record<string, number> = {}
  posts.forEach(p => { map[p.categoria] = (map[p.categoria] || 0) + 1 })
  return Object.entries(map)
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const post = getPostBySlug(slug)
  if (!post) return []
  return getAllPosts()
    .filter(p => p.slug !== slug && p.categoria === post.categoria)
    .slice(0, limit)
}

export function savePost(slug: string, data: Partial<Post> & { conteudo: string }): void {
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true })
  const frontmatter = {
    titulo: data.titulo || '',
    excerpt: data.excerpt || '',
    data: data.data || new Date().toISOString().split('T')[0],
    autor: data.autor || 'Editora Sétimo Selo',
    categoria: data.categoria || 'Geral',
    imagem: data.imagem || '',
    tags: data.tags || [],
    publicado: data.publicado !== false,
  }
  const fileContent = matter.stringify(data.conteudo, frontmatter)
  fs.writeFileSync(path.join(postsDir, `${slug}.md`), fileContent, 'utf8')
}

export function deletePost(slug: string): void {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}
