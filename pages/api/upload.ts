import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import fs from 'fs'
import path from 'path'

export const config = { api: { bodyParser: false } }

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  ensureDir()

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const formidable = require('formidable')
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    })

    form.parse(req, (err: Error, _fields: unknown, files: Record<string, unknown>) => {
      if (err) return res.status(500).json({ error: err.message })

      const uploaded = Array.isArray(files.file) ? files.file[0] : files.file as { filepath: string; originalFilename?: string }
      if (!uploaded) return res.status(400).json({ error: 'Nenhum arquivo recebido' })

      const ext = path.extname(uploaded.originalFilename || '.jpg')
      const base = path.basename(uploaded.originalFilename || 'imagem', ext)
        .toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      const newName = `${base}-${Date.now()}${ext}`
      const newPath = path.join(UPLOAD_DIR, newName)

      fs.renameSync(uploaded.filepath, newPath)
      return res.status(200).json({ url: `/uploads/${newName}` })
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro no upload' })
  }
}
