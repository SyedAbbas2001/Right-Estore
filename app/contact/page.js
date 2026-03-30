'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: faPhone, label: 'Phone', value: '+92 321 1234567', sub: 'Mon-Sat, 9am-7pm', color: 'text-pink-500 bg-pink-50' },
  { icon: faEnvelope, label: 'Email', value: 'hello@rightestore.pk', sub: 'Reply within 24 hours', color: 'text-purple-500 bg-purple-50' },
  { icon: faLocationDot, label: 'Location', value: 'DHA Phase 6, Karachi', sub: 'Sindh, Pakistan', color: 'text-blue-500 bg-blue-50' },
  { icon: faClock, label: 'Hours', value: 'Mon-Sat: 9am-7pm', sub: 'Sunday: 10am-5pm', color: 'text-green-500 bg-green-50' },
];

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 2-5 business days within Pakistan. Express delivery available for Karachi and Lahore (1-2 days).' },
  { q: 'What is your return policy?', a: 'We offer a 15-day hassle-free return policy. Items must be unused and in original packaging.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer COD across Pakistan. You pay when your order arrives at your doorstep.' },
  { q: 'Are your products safe for children?', a: 'Absolutely! All products are tested for child safety and comply with international safety standards.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Message sent! We'll reply within 24 hours 📬");
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-14 sm:py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">📬</div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Get in Touch</h1>
          <p className="text-white/80 font-semibold text-base sm:text-lg">We'd love to hear from you. Our team is always here to help!</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        {/* Info cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {contactInfo.map(({ icon, label, value, sub, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft text-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <FontAwesomeIcon icon={icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="font-black text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-bold text-gray-800 text-xs sm:text-sm">{value}</p>
              <p className="text-gray-400 text-[10px] sm:text-xs font-semibold">{sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-soft p-5 sm:p-6">
            <h2 className="font-display text-2xl text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">Your Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Sara Ahmed" className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="sara@example.com" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-2">Subject</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field">
                  <option value="">Select a topic</option>
                  <option value="order">Order Issue</option>
                  <option value="product">Product Query</option>
                  <option value="return">Return / Refund</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-2">Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us how we can help..." className="input-field h-32 resize-none" required />
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="btn-primary w-full py-4 justify-center disabled:opacity-70">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  : <><FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-display text-2xl text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3 mb-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-800 hover:text-purple-600 transition-colors text-sm">
                    <span className="pr-4">{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-black">
                      ▾
                    </motion.span>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 text-sm font-semibold text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div className="bg-green-50 border border-green-200 rounded-3xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-green-800">Chat on WhatsApp</p>
                <p className="text-green-600 font-semibold text-sm">Get instant answers from our team</p>
              </div>
              <a href="https://wa.me/923211234567" target="_blank" rel="noopener noreferrer"
                className="bg-green-500 text-white font-black text-sm px-4 py-2 rounded-xl hover:bg-green-600 transition-colors whitespace-nowrap flex-shrink-0">
                Chat Now →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
