import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: { bodyParser: false },
}

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Não autorizado' })

  ensureUploadDir()

  const form = formidable({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }) => !!mimetype?.startsWith('image/'),
  })

  form.parse(req, (err, _fields, files) => {
    if (err) {
      console.error('Upload error:', err)
      return res.status(500).json({ error: 'Erro no upload: ' + err.message })
    }

    const uploaded = Array.isArray(files.file) ? files.file[0] : files.file as File
    if (!uploaded) return res.status(400).json({ error: 'Nenhum arquivo recebido' })

    // Renomear para nome legível
    const ext = path.extname(uploaded.originalFilename || '.jpg')
    const base = path.basename(uploaded.originalFilename || 'imagem', ext)
    const ts = Date.now()
    const newName = `${sanitizeFilename(base)}-${ts}${ext}`
    const newPath = path.join(UPLOAD_DIR, newName)

    fs.renameSync(uploaded.filepath, newPath)

    return res.status(200).json({ url: `/uploads/${newName}` })
  })
}
