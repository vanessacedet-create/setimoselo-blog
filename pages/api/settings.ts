import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { getSettings, saveSettings } from '../../lib/settings'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const settings = getSettings()
    return res.status(200).json(settings)
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  if (req.method === 'POST') {
    try {
      saveSettings(req.body)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Erro ao salvar configurações' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
