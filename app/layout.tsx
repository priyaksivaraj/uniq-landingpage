import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'UniqJobs – Software Training & Placement Institute in Chennai',
  description:
    'UniqJobs is a leading software training institute in Chennai offering IT courses with 100% placement support. Java, Python, Full Stack, DevOps & more. Established 2007. ISO certified.',
  keywords: [
    'software training institute in Chennai',
    'full stack developer course with placement',
    'IT training with job assistance',
    'best software training institute in Tamil Nadu',
    'Java full stack training Chennai',
    'Python training with placement',
    'UniqJobs',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'UniqJobs – Software Training & Placement Institute',
    description: 'Learn industry-ready software skills with real-time projects. 100% Placement Support. 25,000+ Careers Launched.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-black text-white">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18086645889"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18086645889');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
