'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faBox, faTruck, faHouseChimney, faGift, faStar, faSparkles, faRainbow, faRibbon, faHeart, faBalloon, faMoneyBillTrendUp, faCreditCard, faShoppingBag, faCircle } from '@fortawesome/free-solid-svg-icons';

const confettiIcons = [faStar, faGift, faSparkles, faRainbow, faCircleCheck, faRibbon, faHeart, faBalloon];

function ConfettiPiece({ delay, left, icon }) {
  return (
    <motion.div
      initial={{ y: -50, x: left, opacity: 1, rotate: 0 }}
      animate={{ y: '110vh', rotate: 360, opacity: [1, 1, 0] }}
      transition={{ duration: 3.5, delay, ease: 'easeIn' }}
      className="fixed top-0 pointer-events-none z-50"
      style={{ left: `${left}%` }}>
      <FontAwesomeIcon icon={icon} className="text-2xl sm:text-3xl" />
    </motion.div>
  );
}

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'KS000000';
  const method = searchParams.get('method') || 'cod';
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const pieces = [...Array(20)].map((_, i) => ({
    delay: Math.random() * 2,
    left: Math.random() * 100,
    icon: confettiIcons[Math.floor(Math.random() * confettiIcons.length)],
  }));

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 3);

  const trackingSteps = [
    { icon: faCircleCheck, label: 'Order Confirmed', done: true, time: 'Just now' },
    { icon: faBox, label: 'Preparing Order', done: false, time: 'In 24 hours' },
    { icon: faTruck, label: 'Out for Delivery', done: false, time: '1-2 days' },
    { icon: faHouseChimney, label: 'Delivered', done: false, time: estDate.toLocaleDateString('en-PK', { weekday: 'long', month: 'short', day: 'numeric' }) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {showConfetti && pieces.map((p, i) => <ConfettiPiece key={i} {...p} />)}

      <div className="max-w-lg w-full">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white rounded-4xl p-7 sm:p-8 shadow-2xl shadow-purple-100 mb-6 text-center">

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 18 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-xl">
            <FontAwesomeIcon icon={faCircleCheck} className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="text-4xl mb-3"><FontAwesomeIcon icon={faCircleCheck} className="w-10 h-10 text-green-500" /></div>
            <h1 className="font-display text-4xl sm:text-5xl text-gray-800 mb-2">Order Placed!</h1>
            <p className="text-gray-500 font-semibold mb-1 text-sm sm:text-base">Thank you for shopping with KiddyShop!</p>
            <p className="text-gray-400 font-semibold text-xs sm:text-sm mb-6">Confirmation sent to your email shortly.</p>

            <div className="bg-purple-50 rounded-2xl px-6 py-4 mb-5">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-1">Order ID</p>
              <p className="font-display text-3xl text-purple-600">#{orderId}</p>
            </div>

            <div className={`rounded-2xl px-5 py-3 mb-6 ${method === 'cod' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              <p className="font-bold text-sm">
                {method === 'cod'
                  ? <><FontAwesomeIcon icon={faMoneyBillTrendUp} className="mr-2" />Cash on Delivery — Pay when you receive</>
                  : <><FontAwesomeIcon icon={faCreditCard} className="mr-2" />Card Payment Processed Successfully</>}
              </p>
            </div>

            <div className="space-y-2.5 text-left mb-7">
              {trackingSteps.map(({ icon, label, done, time }, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-2xl ${done ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <FontAwesomeIcon icon={icon} className={`w-4 h-4 ${done ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${done ? 'text-green-800' : 'text-gray-600'}`}>{label}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{time}</span>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/orders" className="btn-outline text-center py-3 text-sm">Track Order</Link>
              <Link href="/products">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary w-full py-3 justify-center text-sm">
                  <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4 mr-2" />Shop More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-5 sm:p-6 text-white text-center">
          <FontAwesomeIcon icon={faGift} className="w-8 h-8 mb-2 mx-auto" />
          <h3 className="font-display text-xl sm:text-2xl mb-1">Here's a Gift!</h3>
          <p className="text-white/80 text-sm font-semibold mb-3">10% off your next order</p>
          <div className="bg-white/20 rounded-2xl px-6 py-3 inline-block">
            <span className="font-display text-2xl tracking-widest">KIDDY10</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-6xl animate-bounce"><FontAwesomeIcon icon={faGift} className="w-16 h-16 text-purple-500" /></div></div>}>
      <OrderContent />
    </Suspense>
  );
}
