import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'
import Script from 'next/script'

interface Settings {
  nome?: string
  descricao?: string
  logo?: string
  googleAnalytics?: string
  storeUrl?: string
  email?: string
  instagram?: string
  facebook?: string
  youtube?: string
  twitter?: string
  tiktok?: string
  whatsapp?: string
  [key: string]: string | undefined
}

interface Categoria { id: string; slug: string; label: string }

interface Props {
  children: React.ReactNode
  title?: string
  description?: string
  ogImage?: string
  categorias?: Categoria[]
  settings?: Settings
}

export default function Layout({ children, title, description, ogImage, categorias = [], settings = {} }: Props) {
  const siteName = settings.nome || 'Blog Editora Sétimo Selo'
  const siteTitle = title ? `${title} | ${siteName}` : `${siteName} — Literatura e Espiritualidade`
  const siteDesc = description || settings.descricao || 'Literatura, espiritualidade e pensamento clássico. Blog da Editora Sétimo Selo.'

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href={settings.logo || '/images/logo.png'} />
      </Head>

      {settings.googleAnalytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.googleAnalytics}');
          `}</Script>
        </>
      )}

      <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
        <Header categorias={categorias} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </div>
    </>
  )
}
