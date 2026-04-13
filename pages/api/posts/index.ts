import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { getAllPosts, savePost } from '../../../lib/posts'
import { slugify } from '../../../lib/slugify'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const posts = getAllPosts()
    return res.status(200).json(posts)
  }

  // POST - criar novo artigo (requer autenticação)
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  if (req.method === 'POST') {
    try {
      const { titulo, slug, excerpt, categoria, autor, data, imagem, tags, publicado, conteudo } = req.body

      if (!titulo || !conteudo) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' })
      }

      const finalSlug = slugify(slug || titulo)

      savePost(finalSlug, {
        titulo, excerpt, categoria, autor, data, imagem,
        tags: Array.isArray(tags) ? tags : [],
        publicado: publicado !== false,
        conteudo,
        slug: finalSlug,
      })

      return res.status(201).json({ slug: finalSlug })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro interno' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
