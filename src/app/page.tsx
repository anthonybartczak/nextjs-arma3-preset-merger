import Image from 'next/image'
import TransferList from '../components/TransferList'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-12">
      <div>
        <h1 className='text-4xl'>Arma 3 HTML preset merger</h1>
      </div>
      <TransferList />
    </main>
  )
}
