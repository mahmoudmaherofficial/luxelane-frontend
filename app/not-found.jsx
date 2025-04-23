import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <p className="text-2xl font-bold mb-4">Not Found</p>
        <p className="mb-4">The page you're looking for is not available.</p>
        <Link href="/" className="text-sky-500 hover:underline">
          Back Home
        </Link>
      </div>
    </div>
  )
}
