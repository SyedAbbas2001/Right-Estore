'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faShoppingBag, faArrowRight, faStar, faTruck } from '@fortawesome/free-solid-svg-icons';
import { bannerSlides } from '@/data/products';

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = () => go((current + 1) % bannerSlides.length, 1);
  const prev = () => go((current - 1 + bannerSlides.length) % bannerSlides.length, -1);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [current]);

  const slide = bannerSlides[current];

  const variants = {
    enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: d => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="relative h-[88vh] min-h-[520px] max-h-[750px] overflow-hidden">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div key={current} custom={direction} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}>

          {/* Floating blobs */}
          {[
            { size: 300, top: '5%', left: '-5%', delay: 0, opacity: 0.12 },
            { size: 200, bottom: '10%', left: '8%', delay: 1, opacity: 0.1 },
            { size: 250, top: '15%', right: '-3%', delay: 0.5, opacity: 0.1 },
            { size: 150, bottom: '20%', right: '12%', delay: 1.5, opacity: 0.15 },
            { size: 100, top: '45%', left: '45%', delay: 2, opacity: 0.08 },
          ].map((blob, i) => (
            <motion.div key={i}
              animate={{ y: [0, -20, 0], rotate: [0, 5, -3, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: blob.delay }}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{ width: blob.size, height: blob.size, top: blob.top, left: blob.left, right: blob.right, bottom: blob.bottom, opacity: blob.opacity }} />
          ))}

          {/* Stars */}
          {[...Array(8)].map((_, i) => (
            <motion.div key={`star-${i}`}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              className="absolute text-white/60 text-lg pointer-events-none"
              style={{ top: `${10 + (i * 12) % 80}%`, left: `${5 + (i * 15) % 90}%` }}>
              ✦
            </motion.div>
          ))}

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">

              {/* Text */}
              <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }} className="text-white z-10">

                {/* Badge */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-5">
                  <span className="text-lg">{slide.emoji}</span>
                  <span className="font-bold text-sm">{slide.badge}</span>
                  <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-yellow-300" />
                </motion.div>

                <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-2">
                  {slide.title}
                </motion.h1>
                <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-display text-2xl sm:text-3xl text-white/90 mb-4">
                  {slide.subtitle}
                </motion.h2>
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-white/80 text-base sm:text-lg font-semibold mb-8 max-w-md leading-relaxed">
                  {slide.description}
                </motion.p>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4 mb-8">
                  <Link href={slide.href}>
                    <motion.button whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
                      className="bg-white text-gray-800 font-black px-7 py-3.5 rounded-full flex items-center gap-2 shadow-2xl text-base hover:shadow-white/30">
                      <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4" />
                      {slide.cta}
                    </motion.button>
                  </Link>
                  <Link href="/products">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="border-2 border-white/60 text-white font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-white/15 transition-colors text-base">
                      View All <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Trust pills */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-3">
                  {['⭐ 4.9 Rated', '🚚 Free Shipping', '↩️ Easy Returns'].map((t, i) => (
                    <span key={i} className="bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div initial={{ x: 60, opacity: 0, scale: 0.9 }} animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.65 }}
                className="hidden lg:flex justify-center items-center relative">
                <div className="relative">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl bg-white/20 blur-3xl" />
                  <div className="relative w-80 xl:w-96 h-80 xl:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Floating cards */}
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-3 text-center min-w-[80px]">
                    <div className="text-2xl mb-1">🎉</div>
                    <p className="text-xs font-black text-gray-700">New!</p>
                  </motion.div>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-3">
                    <p className="text-xs font-black text-purple-500 leading-none">Up to</p>
                    <p className="font-display text-xl text-pink-500 leading-tight">40% OFF</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {[
        { side: 'left-3 sm:left-5', icon: faChevronLeft, fn: prev },
        { side: 'right-3 sm:right-5', icon: faChevronRight, fn: next },
      ].map(({ side, icon, fn }) => (
        <motion.button key={side} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={fn}
          className={`absolute ${side} top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/35 transition-colors z-20`}>
          <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        </motion.button>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {bannerSlides.map((_, i) => (
          <motion.button key={i} onClick={() => go(i)} animate={{ width: i === current ? 28 : 10 }}
            className={`h-2.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
}
