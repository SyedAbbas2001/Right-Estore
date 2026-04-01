'use client';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-pink to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-wiggle inline-block">😅</div>
        <h1 className="font-display text-4xl text-gray-800 mb-3">Something Went Wrong!</h1>
        <p className="text-gray-500 font-semibold mb-8">
          Our magical elves are working hard to fix this. Please try again!
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary px-8 py-3">
            Try Again 🔄
          </button>
          <Link href="/" className="btn-secondary px-8 py-3">
            Go Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
