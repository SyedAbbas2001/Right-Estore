"use client";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const links = {
  shop: [
    { label: 'Garments', href: '/products?category=garments' },
    { label: 'New Born', href: '/products?category=newborn' },
    { label: 'Toys', href: '/products?category=toys' },
    { label: 'Stationery', href: '/products?category=stationery' },
    { label: 'New Arrivals', href: '/products?filter=new' },
    { label: 'Sale', href: '/products?filter=sale' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
    { label: 'Order History', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Track Order', href: '/track-order' },
  ],
  info: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const socials = [
  { icon: faInstagram, href: '#', color: 'hover:text-pink-400' },
  { icon: faFacebook, href: '#', color: 'hover:text-blue-400' },
  { icon: faTwitter, href: '#', color: 'hover:text-sky-400' },
  { icon: faYoutube, href: '#', color: 'hover:text-red-400' },
  { icon: faTiktok, href: '#', color: 'hover:text-white' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Newsletter */}
      <div className="gradient-animate py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-4xl sm:text-5xl mb-3">📬</div>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-2">Get Magical Deals!</h3>
          <p className="text-white/80 mb-6 font-semibold text-sm sm:text-base">Subscribe for exclusive offers, new arrivals & parenting tips</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your email address"
              className="flex-1 px-5 py-3.5 rounded-2xl text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-white/60 text-sm" />
            <button type="submit"
              className="bg-white text-purple-700 font-black px-6 py-3.5 rounded-2xl hover:bg-gray-100 transition-colors whitespace-nowrap text-sm">
              Subscribe ✨
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl">🧸</div>
              <span className="font-display text-2xl">Kiddy<span className="text-pink-400">Shop</span></span>
            </div>
            <p className="text-gray-400 font-semibold text-sm leading-relaxed mb-5">
              Making childhood magical, one product at a time. Quality kids' clothing, toys and essentials delivered across Pakistan.
            </p>
            <div className="space-y-2.5">
              {[
                { icon: faPhone, text: '+92 321 1234567' },
                { icon: faEnvelope, text: 'hello@rightestore.pk' },
                { icon: faLocationDot, text: 'Karachi, Pakistan' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-gray-400">
                  <FontAwesomeIcon icon={icon} className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-sm font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {[
            { title: 'Shop', items: links.shop },
            { title: 'Account', items: links.account },
            { title: 'Info', items: links.info },
          ].map(({ title, items }) => (
            <div key={title}>
              <h4 className="font-display text-lg text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-400 font-semibold text-sm hover:text-pink-400 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs sm:text-sm font-semibold text-center sm:text-left">
            © 2024 Right Estore. Made with ❤️ for little ones in Pakistan 🇵🇰
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon, href, color }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 ${color} hover:bg-gray-700 transition-all hover:scale-110`}>
                <FontAwesomeIcon icon={icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
