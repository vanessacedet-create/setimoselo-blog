import Link from 'next/link'
import Head from 'next/head'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página não encontrada | Blog Sétimo Selo</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        background: 'var(--grad-banner)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div>
          <div style={{ fontSize: '5rem', marginBottom: '1rem', opacity: 0.6 }}>📖</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'white',
            marginBottom: '1rem',
          }}>
            Página não encontrada
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            O artigo que você procura pode ter sido movido ou não existe.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-ouro">← Voltar ao Início</Link>
            <Link href="/busca" className="btn-ler">🔍 Buscar Artigos</Link>
          </div>
        </div>
      </div>
    </>
  )
}
