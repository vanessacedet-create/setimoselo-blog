import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllCategories } from '../../lib/posts'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' })
  const categorias = getAllCategories()
  return res.status(200).json(categorias)
}
