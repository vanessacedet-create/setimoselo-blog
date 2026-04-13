import React, { useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
}

export default function PostEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [uploading, setUploading] = useState(false)

  function wrap(before: string, after = before, placeholder = 'texto') {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const sel = ta.value.substring(start, end) || placeholder
    const novo = ta.value.substring(0, start) + before + sel + after + ta.value.substring(end)
    onChange(novo)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, start + before.length + sel.length)
    }, 0)
  }

  function insertAtCursor(text: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const novo = ta.value.substring(0, start) + text + ta.value.substring(start)
    onChange(novo)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  async function handleImageUpload() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      setUploading(true)
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      setUploading(false)
      if (data.url) {
        insertAtCursor(`\n![${file.name}](${data.url})\n`)
      } else {
        alert('Erro no upload: ' + (data.error || 'desconhecido'))
      }
    }
    input.click()
  }

  const toolbarGroups = [
    {
      items: [
        { label: 'H2', title: 'Subtítulo', action: () => insertAtCursor('\n## Subtítulo\n') },
        { label: 'H3', title: 'Seção', action: () => insertAtCursor('\n### Seção\n') },
      ]
    },
    {
      items: [
        { label: 'B', title: 'Negrito', action: () => wrap('**', '**', 'texto em negrito') },
        { label: 'I', title: 'Itálico', action: () => wrap('_', '_', 'texto em itálico') },
        { label: '❝', title: 'Citação', action: () => wrap('\n> ', '', 'citação aqui') },
      ]
    },
    {
      items: [
        { label: '🔗', title: 'Link', action: () => wrap('[', '](https://url)', 'texto do link') },
        { label: '🖼', title: 'Imagem por URL', action: () => insertAtCursor('\n![descrição](https://url-da-imagem)\n') },
        { label: uploading ? '⏳' : '📤', title: 'Upload de imagem', action: handleImageUpload },
      ]
    },
    {
      items: [
        { label: '—', title: 'Linha divisória', action: () => insertAtCursor('\n\n---\n\n') },
        { label: '• Lista', title: 'Lista', action: () => insertAtCursor('\n- Item 1\n- Item 2\n- Item 3\n') },
        { label: '1. Lista', title: 'Lista numerada', action: () => insertAtCursor('\n1. Item 1\n2. Item 2\n3. Item 3\n') },
      ]
    },
    {
      items: [
        {
          label: '🛒 Btn Loja',
          title: 'Botão para loja',
          action: () => insertAtCursor('\n<a href="https://editorasetimoselo.com.br" class="btn-loja" target="_blank">Comprar na Livraria →</a>\n')
        },
        {
          label: '📦 Destaque',
          title: 'Caixa de destaque',
          action: () => insertAtCursor('\n<div class="destaque-box">\n\n**Sabia que?** Texto de destaque aqui.\n\n</div>\n')
        },
      ]
    },
  ]

  return (
    <div>
      <div className="editor-toolbar">
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="editor-btn-group">
            {group.items.map(item => (
              <button
                key={item.label}
                type="button"
                className="editor-btn"
                title={item.title}
                onClick={item.action}
                disabled={uploading && item.label.includes('Upload')}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className="form-textarea editor-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Escreva o conteúdo do artigo em Markdown...

## Subtítulo

Parágrafo normal com **negrito** e _itálico_.

> Citação marcante do livro ou autor.

Use os botões acima para formatar rapidamente."
        style={{ minHeight: '500px', borderRadius: '0 0 var(--raio) var(--raio)', borderTop: 'none' }}
      />
      <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>
        Markdown suportado · HTML inline permitido · Use os botões de atalho acima
      </div>
    </div>
  )
}
