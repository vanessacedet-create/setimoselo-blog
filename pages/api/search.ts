import type { NextApiRequest, NextApiResponse } from 'next'
import { searchPosts } from '../../lib/posts'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' })
  const q = (req.query.q as string) || ''
  if (!q.trim()) return res.status(200).json([])
  const results = searchPosts(q)
  return res.status(200).json(results)
}
