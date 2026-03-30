import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faStar, faRainbow, faGift, faSparkles, faHeart, faLeaf, faGlobe, faHandsHelping, faShoppingBag, faUserTie, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

export const metadata = {
  title: 'About Us',
  description: 'Learn about KiddyShop — our story, mission and the team behind the magic.',
};

const team = [
  { name: 'Ayesha Malik', role: 'Founder & CEO', icon: faUserTie, desc: 'Mom of 2, passionate about quality kids\' products' },
  { name: 'Usman Ahmed', role: 'Head of Products', icon: faUser, desc: 'Curates the best products for little ones' },
  { name: 'Sara Khan', role: 'Customer Experience', icon: faUsers, desc: 'Ensures every parent has a magical experience' },
];

const values = [
  { icon: faLeaf, title: 'Safe Materials', desc: 'Every product is tested for child safety and uses non-toxic, child-safe materials.' },
  { icon: faHeart, title: 'Made with Love', desc: 'We handpick every product with the same care as if it were for our own children.' },
  { icon: faGlobe, title: 'Sustainable', desc: 'We prioritize eco-friendly products and sustainable packaging wherever possible.' },
  { icon: faHandsHelping, title: 'Community First', desc: 'Built by parents, for parents. We listen to our community and improve constantly.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-candy-purple via-candy-pink to-candy-blue py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[faPuzzlePiece, faStar, faRainbow, faGift, faSparkles].map((icon, i) => (
            <div key={i} className="absolute animate-float"
              style={{ top: `${15 + i * 18}%`, left: `${10 + i * 20}%`, animationDelay: `${i * 0.5}s` }}>
              <FontAwesomeIcon icon={icon} className="text-6xl" />
            </div>
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="text-6xl mb-4"><FontAwesomeIcon icon={faPuzzlePiece} className="w-16 h-16" /></div>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Our Story</h1>
          <p className="text-white/80 text-xl font-semibold leading-relaxed">
            Born from a parent's frustration of finding quality, affordable, and safe products for kids in Pakistan — KiddyShop is our answer.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-pastel-purple rounded-full px-4 py-2 mb-5">
          <FontAwesomeIcon icon={faHeart} className="w-4 h-4 text-candy-purple" />
          <span className="text-candy-purple font-bold text-sm">Our Mission</span>
        </div>
        <h2 className="font-display text-4xl text-gray-800 mb-6">Making Childhood Magical</h2>
        <p className="text-gray-600 font-semibold text-lg leading-relaxed mb-6">
          At KiddyShop, we believe every child deserves access to beautiful, safe, and educational products that spark their imagination and support their development.
        </p>
        <p className="text-gray-600 font-semibold text-lg leading-relaxed">
          Founded in 2023 in Karachi, we started with a small selection of imported baby clothes. Today, we stock over 500 products across 4 categories, serving families in 200+ cities across Pakistan.
        </p>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-gray-800 text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-soft text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-4"><FontAwesomeIcon icon={v.icon} className="w-10 h-10 text-candy-purple" /></div>
                <h3 className="font-display text-xl text-gray-800 mb-3">{v.title}</h3>
                <p className="text-gray-500 font-semibold text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl text-gray-800 text-center mb-12">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-soft text-center hover:shadow-candy transition-all">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-candy-pink to-candy-purple mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon icon={member.icon} className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-display text-xl text-gray-800 mb-1">{member.name}</h3>
              <p className="text-candy-purple font-bold text-sm mb-3">{member.role}</p>
              <p className="text-gray-500 font-semibold text-sm">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-candy-pink to-candy-purple px-4 text-center">
        <div className="text-4xl mb-4"><FontAwesomeIcon icon={faShoppingBag} className="w-10 h-10 text-white" /></div>
        <h2 className="font-display text-4xl text-white mb-4">Ready to Shop?</h2>
        <p className="text-white/80 font-semibold mb-8">Discover hundreds of magical products for your little ones</p>
        <Link href="/products" className="bg-white text-candy-purple font-bold text-lg px-10 py-4 rounded-full hover:bg-gray-100 transition-colors inline-block">
          Start Shopping <FontAwesomeIcon icon={faSparkles} className="inline-block w-4 h-4 ml-2" />
        </Link>
      </section>
    </div>
  );
}
