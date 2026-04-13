import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

export default function LoginPage() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await signIn('credentials', {
      password: senha,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      window.location.href = '/admin'
    } else {
      setErro('Senha incorreta. Verifique e tente novamente.')
    }
  }

  return (
    <>
      <Head>
        <title>Admin | Blog Sétimo Selo</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7a221e, #621510)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto', fontSize: '1.8rem',
            }}>
              🔒
            </div>
          </div>
          <h1 className="login-title">Painel Admin</h1>
          <p className="login-subtitle">Blog Editora Sétimo Selo</p>

          {erro && <div className="error-msg">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Senha de Acesso</label>
              <input
                type="password"
                className="form-input"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Digite a senha..."
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="btn-ler"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar no Painel →'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (session) return { redirect: { destination: '/admin', permanent: false } }
  return { props: {} }
}
