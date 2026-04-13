import Link from 'next/link'
import Head from 'next/head'

export default function NotFound() {
  return (
    <>
      <Head><title>Página não encontrada | Blog Sétimo Selo</title></Head>
      <div className="min-h-screen flex items-center justify-center text-center px-6"
        style={{ background: 'linear-gradient(135deg, #7a221e 0%, #621510 100%)' }}>
        <div>
          <p className="font-display text-6xl font-bold mb-4" style={{ color: 'rgba(208,171,88,0.3)' }}>404</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Página não encontrada</h1>
          <p className="font-serif text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            O artigo que você procura pode ter sido movido ou não existe.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/" className="font-display text-xs tracking-[0.15em] uppercase font-semibold px-6 py-3 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #d0ab58 0%, #aa8737 100%)', color: '#621510' }}>
              ← Início
            </Link>
            <Link href="/busca" className="font-display text-xs tracking-[0.15em] uppercase font-semibold px-6 py-3 border text-white transition-opacity hover:opacity-90"
              style={{ borderColor: 'rgba(208,171,88,0.4)' }}>
              Buscar
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
