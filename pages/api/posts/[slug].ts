import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import { getPostBySlug, savePost, deletePost } from '../../../lib/posts'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  const slug = req.query.slug as string

  if (req.method === 'GET') {
    const post = getPostBySlug(slug)
    if (!post) return res.status(404).json({ error: 'Post não encontrado' })
    return res.status(200).json(post)
  }

  if (req.method === 'PUT') {
    try {
      const { titulo, excerpt, categoria, autor, data, imagem, tags, publicado, conteudo } = req.body

      if (!titulo || !conteudo) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' })
      }

      savePost(slug, {
        slug,
        titulo,
        excerpt: excerpt || '',
        categoria: categoria || 'Geral',
        autor: autor || 'Editora Sétimo Selo',
        data: data || new Date().toISOString().split('T')[0],
        imagem: imagem || '',
        tags: Array.isArray(tags) ? tags : [],
        publicado: publicado !== false,
        conteudo,
      })

      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro ao salvar' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      deletePost(slug)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro ao excluir' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
