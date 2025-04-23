// import Link from "next/link";

// export default function ForbiddenPage() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold mb-2">403</h1>
//         <p className="text-2xl font-bold mb-4">Forbidden</p>
//         <p className="mb-4">You do not have permission to access this page.</p>
//         <p className="mb-4">Please contact your administrator if you believe this is an error.</p>
//         <Link href="/" className="text-sky-500 hover:underline">
//           Back Home
//         </Link>
//       </div>
//     </div>
//   )
// }

'use client'
import Link from 'next/link'

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-slate-900">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <h2 className="text-3xl font-semibold mb-6">Access Forbidden</h2>
      <p className="text-lg text-slate-700 mb-8 text-center">
        Sorry, you don't have permission to access this page.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-slate-900 text-slate-100 hover:bg-slate-800 rounded px-4 py-2 transition-all"
        >
          Go Home
        </Link>
        <Link
          href="/login"
          className="bg-slate-100 text-slate-900 hover:bg-slate-50 rounded px-4 py-2 transition-all"
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default ForbiddenPage
