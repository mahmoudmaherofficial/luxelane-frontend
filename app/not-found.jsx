import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-100 select-none">
      <h1 className="text-6xl font-bold mb-4 text-primary-900">404</h1>
      <h2 className="text-3xl font-semibold mb-4 text-primary-900">Page Not Found</h2>
      <p className="text-lg text-primary-800 mb-8 text-center">Sorry, the page you are looking for does not exist.</p>
        <Link
          href="/"
          className="bg-primary-900 text-primary-100 hover:bg-primary-800 rounded px-4 py-2 transition-all">
          Go Home
        </Link>
    </div>
  );
}
