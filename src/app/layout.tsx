import './globals.css'
import type { Metadata } from 'next'
import { Chakra_Petch } from 'next/font/google'
import ThemeProvider from './providers/NextThemeProvider'
import PiwikProWrapper from './providers/PiwikProProvider'

const chakra_petch = Chakra_Petch({weight: "400", subsets: ["latin"]})

export const metadata: Metadata = {
  title: 'Arma 3 HTML Preset Merger',
  description: 'Easily merge your Arma 3 presets with our intuitive tool. Combine multiple presets, identify duplicates, and streamline your Arma 3 experience.',
  openGraph: {
    title: 'Arma 3 HTML Preset Merger',
    description: 'Easily merge your Arma 3 presets with our intuitive tool. Combine multiple presets, identify duplicates, and streamline your Arma 3 experience.',
    images: ["https://i.imgur.com/PGx0cQx.png"],
    url: "https://merger.anteriam.pl",
    type: "website"
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={chakra_petch.className}>
      <div className='absolute top-0 left-0 whitespace-nowrap'>
        <div className='text-gray-300 text-sm p-3 m-2 rounded-md bg-neutral-700'>
          <p>Made with ❤️ for </p><a href="https://www.reddit.com/r/arma/" className=''>the Arma community</a>
        </div>
        <div className='text-gray-300 text-sm p-3 m-2 rounded-md bg-neutral-700'>
          <p>Need help?</p><p></p><a href="https://discord.gg/BnzCCK6c" className=''>canadian6199 🫡</a>
        </div>
      </div>
      <PiwikProWrapper>
        <ThemeProvider>
            {children}
        </ThemeProvider>
      </PiwikProWrapper>
      </body>
    </html>
  )
}
