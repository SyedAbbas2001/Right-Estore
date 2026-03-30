import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faStar, faSparkles } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="text-7xl animate-bounce"><FontAwesomeIcon icon={faPuzzlePiece} className="w-16 h-16" /></div>
          <div className="absolute -top-2 -right-6 text-3xl animate-float" style={{animationDelay: '0.3s'}}><FontAwesomeIcon icon={faStar} className="w-8 h-8" /></div>
          <div className="absolute -bottom-2 -left-6 text-2xl animate-float" style={{animationDelay: '0.6s'}}><FontAwesomeIcon icon={faSparkles} className="w-6 h-6" /></div>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {['bg-pink-400', 'bg-purple-500', 'bg-blue-400', 'bg-amber-400'].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${c} animate-bounce`} style={{animationDelay: `${i * 0.15}s`}} />
          ))}
        </div>
        <p className="font-display text-2xl text-purple-600">Loading magic...</p>
        <p className="text-gray-400 font-semibold text-sm mt-2">Preparing something wonderful <FontAwesomeIcon icon={faSparkles} className="inline-block w-4 h-4" /></p>
      </div>
    </div>
  );
}
