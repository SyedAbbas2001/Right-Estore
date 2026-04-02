'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck, faRotateLeft, faShieldHalved, faHeadset, faCertificate,
  faQuoteLeft, faStar
} from '@fortawesome/free-solid-svg-icons';
import { stats, testimonials } from '@/data/products';

export function StatsSection() {
  return (
    <section className="py-14 sm:py-16 gradient-animate">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className="text-white">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + i, repeat: Infinity }}
                className="text-3xl sm:text-4xl mb-2">{stat.emoji}</motion.div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-1">{stat.value}</div>
              <div className="text-white/80 font-bold text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-4 py-2 mb-4">
            <span>💬</span>
            <span className="text-pink-600 font-black text-sm">What Parents Say</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-800">Loved by Families</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 180 }}
              whileHover={{ y: -6 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-5 sm:p-6 relative border border-purple-100/50 shadow-soft hover:shadow-xl hover:shadow-purple-100 transition-shadow">
              <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-5 right-5 w-8 h-8 text-purple-200" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <FontAwesomeIcon key={j} icon={faStar} className="w-4 h-4 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 font-semibold leading-relaxed mb-5 text-sm sm:text-base relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-200" />
                <div>
                  <p className="font-black text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 font-semibold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromoBanner() {
  const promos = [
    { emoji: '🎀', title: "Girls Collection", subtitle: "Up to 40% off on dresses & sets", color: 'from-pink-400 to-rose-500', href: '/products?category=garments&gender=girls', btn: 'Shop Girls', btnColor: 'text-pink-500 hover:bg-pink-50' },
    { emoji: '🚀', title: "Boys Collection", subtitle: "Fresh styles for active little boys", color: 'from-blue-400 to-cyan-500', href: '/products?category=garments&gender=boys', btn: 'Shop Boys', btnColor: 'text-blue-500 hover:bg-blue-50' },
  ];
  return (
    <section className="py-10 sm:py-14 px-4" style={{overflowX:'hidden'}}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {promos.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-4xl overflow-hidden bg-gradient-to-br ${p.color} p-7 sm:p-10 min-h-[200px] flex flex-col justify-between group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow`}>
            <motion.div animate={{ rotate: [0, 5, -3, 0] }} transition={{ duration: 6, repeat: Infinity }}
              className="absolute right-4 bottom-2 text-8xl sm:text-9xl opacity-20 group-hover:opacity-30 transition-opacity">
              {p.emoji}
            </motion.div>
            <div>
              <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-white font-bold text-xs mb-3">Limited Time</span>
              <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">{p.title}</h3>
              <p className="text-white/80 font-semibold text-sm">{p.subtitle}</p>
            </div>
            <Link href={p.href}>
              <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 bg-white font-bold px-5 py-2.5 rounded-full w-fit ${p.btnColor} transition-colors text-sm mt-4`}>
                {p.btn} →
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function TrustBadges() {
  const badges = [
    { icon: faTruck, label: 'Free Shipping', sub: 'Orders over Rs. 2000', color: 'text-blue-500 bg-blue-50' },
    { icon: faRotateLeft, label: 'Easy Returns', sub: '15-day return policy', color: 'text-green-500 bg-green-50' },
    { icon: faShieldHalved, label: 'Secure Payment', sub: '100% safe checkout', color: 'text-purple-500 bg-purple-50' },
    { icon: faHeadset, label: '24/7 Support', sub: 'Always here to help', color: 'text-pink-500 bg-pink-50' },
    { icon: faCertificate, label: 'Certified Quality', sub: 'GOTS & safety certified', color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <section className="py-8 sm:py-10 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10">
          {badges.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${b.color} flex items-center justify-center flex-shrink-0`}>
                <FontAwesomeIcon icon={b.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="font-black text-gray-800 text-xs sm:text-sm">{b.label}</p>
                <p className="text-gray-400 text-[10px] sm:text-xs font-semibold">{b.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarqueeBanner() {
  const items = ['🧸 New Arrivals', '👗 Kids Fashion', '🎁 Best Gifts', '🚀 Free Shipping', '⭐ Top Rated', '🎨 Art & Craft', '👶 Baby Essentials', '🏆 Award Winners'];
  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-3 overflow-hidden">
      <div className="marquee-track animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-white font-black text-sm mx-6 whitespace-nowrap">{item}</span>
        ))}
      </div>
    </div>
  );
}
