import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-8xl leading-none select-none animate-bounce-slow">🧸</div>
          <div className="absolute -top-4 -right-8 text-4xl animate-float" style={{animationDelay: '0.5s'}}>⭐</div>
          <div className="absolute -bottom-4 -left-8 text-3xl animate-float" style={{animationDelay: '1s'}}>🌟</div>
        </div>
        <h1 className="font-display text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">404</h1>
        <h2 className="font-display text-3xl text-gray-800 mb-3">Page Lost in Toyland!</h2>
        <p className="text-gray-500 font-semibold mb-8 leading-relaxed text-sm sm:text-base">
          This page went on an adventure and got lost! Let us get you back to the magical shop.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-primary text-base px-8 py-4">🏠 Go Home</Link>
          <Link href="/products" className="btn-secondary text-base px-8 py-4">🛍️ Shop Now</Link>
        </div>
        <div className="mt-10 flex justify-center gap-4 text-3xl">
          {['🎈', '🌈', '🎊', '⭐', '🎁'].map((e, i) => (
            <span key={i} className="animate-float" style={{animationDelay: `${i * 0.3}s`, animationDuration: `${3 + i * 0.5}s`}}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
