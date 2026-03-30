'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart, faHeart, faMagnifyingGlass, faBars, faXmark,
  faUser, faChevronDown, faTag, faStar, faFire, faBagShopping, faGift,
  faTshirt, faBaby, faPuzzlePiece, faPenFancy
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore, useWishlistStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/products' },
  {
    label: 'Categories', href: '#',
    children: [
      { label: 'Garments', href: '/products?category=garments', icon: faTshirt },
      { label: 'New Born', href: '/products?category=newborn', icon: faBaby },
      { label: 'Toys', href: '/products?category=toys', icon: faPuzzlePiece },
      { label: 'Stationery', href: '/products?category=stationery', icon: faPenFancy },
    ],
  },
  { label: 'New Arrivals', href: '/products?filter=new', icon: faStar },
  { label: 'Sale', href: '/products?filter=sale', icon: faFire },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const cartItems = useCartStore(s => s.items);
  const wishlistItems = useWishlistStore(s => s.items);
  const openCart = useCartStore(s => s.openCart);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Promo bar */}
      <div className="gradient-animate text-white text-center text-xs sm:text-sm py-2 font-bold tracking-wide">
        <FontAwesomeIcon icon={faGift} className="animate-pulse inline-block mr-2 w-3 h-3" />
        Free Shipping on orders over Rs. 2,000! Code:
        <span className="mx-1 bg-white/25 px-2 py-0.5 rounded-full font-black">KIDDY10</span>
        for 10% off
        <FontAwesomeIcon icon={faGift} className="animate-pulse inline-block ml-2 w-3 h-3" />
      </div>

      {/* Main Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-400 ${scrolled ? 'glass shadow-lg shadow-purple-100/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xl md:text-2xl shadow-lg"
              >
                <FontAwesomeIcon icon={faBagShopping} className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              <span className="font-display text-2xl md:text-3xl text-gray-800">
                Kiddy<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Shop</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <div key={link.label} className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                  <Link href={link.href}
                    className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                      pathname === link.href
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                    }`}>
                    {link.icon && <FontAwesomeIcon icon={link.icon} className="w-3 h-3" />}
                    {link.label}
                    {link.children && <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 ml-0.5" />}
                  </Link>

                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-0 pt-2 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl shadow-purple-100 p-2 min-w-[180px] border border-purple-50">
                          {link.children.map(child => (
                            <Link key={child.href} href={child.href}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                              <FontAwesomeIcon icon={child.icon} className="w-4 h-4" />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-purple-50 hover:text-purple-500 transition-colors">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
              </motion.button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <motion.div whileTap={{ scale: 0.9 }}
                  className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                  <AnimatePresence>
                    {wishlistItems.length > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {wishlistItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              {/* Cart */}
              <motion.button whileTap={{ scale: 0.9 }} onClick={openCart}
                className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-purple-50 hover:text-purple-500 transition-colors">
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Account */}
              <Link href="/account" className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              </Link>

              {/* Mobile menu */}
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="pb-4">
                  <form onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`; }}
                    className="relative">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
                      placeholder="Search clothes, toys, baby essentials..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none font-body font-semibold text-sm bg-purple-50/50" />
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-gray-100 bg-white shadow-xl">
              <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {navLinks.map(link => (
                  <div key={link.label}>
                    <Link href={link.href}
                      className="flex items-center gap-2 py-3 px-4 rounded-2xl text-gray-700 font-bold hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm">
                      {link.icon && <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />}
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4 space-y-1 mt-1">
                        {link.children.map(child => (
                          <Link key={child.href} href={child.href}
                            className="flex items-center gap-2 py-2 px-4 rounded-xl text-sm text-gray-600 font-semibold hover:text-purple-600">
                            <FontAwesomeIcon icon={child.icon} className="w-4 h-4" />{child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 flex gap-2 border-t border-gray-100 mt-2">
                  <Link href="/login" className="flex-1 btn-secondary text-center text-sm py-2.5">Login</Link>
                  <Link href="/signup" className="flex-1 btn-primary text-center text-sm py-2.5">Sign Up</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
