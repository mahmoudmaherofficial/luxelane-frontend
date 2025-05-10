import Link from 'next/link'

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-100 select-none">
      <h1 className="text-6xl font-bold mb-4 text-primary-900">403</h1>
      <h2 className="text-3xl font-semibold mb-4 text-primary-900">Access Forbidden</h2>
      <p className="text-lg text-primary-800 mb-8 text-center">
        Sorry, you don&apos;t have permission to access this page.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-primary-900 text-primary-100 hover:bg-primary-800 rounded px-4 py-2 transition-all">
          Go Home
        </Link>
        <Link href="/login" className=" text-primary-900 hover:bg-primary-50 rounded px-4 py-2 transition-all">
          Login
        </Link>
      </div>
    </div>
  );
}

export default ForbiddenPage
