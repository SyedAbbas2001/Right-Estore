'use client';
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: FiPhone, label: 'Phone', value: '+92 321 1234567', sub: 'Mon–Sat, 9am–7pm', color: 'text-candy-pink bg-pastel-pink' },
  { icon: FiMail, label: 'Email', value: 'hello@kiddyshop.pk', sub: 'Reply within 24 hours', color: 'text-candy-purple bg-pastel-purple' },
  { icon: FiMapPin, label: 'Location', value: 'DHA Phase 6, Karachi', sub: 'Sindh, Pakistan', color: 'text-candy-blue bg-pastel-blue' },
  { icon: FiClock, label: 'Hours', value: 'Mon–Sat: 9am–7pm', sub: 'Sunday: 10am–5pm', color: 'text-candy-green bg-pastel-green' },
];

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 2-5 business days within Pakistan. Express delivery is available for Karachi and Lahore (1-2 days).' },
  { q: 'What is your return policy?', a: 'We offer a 15-day hassle-free return policy. Items must be unused and in original packaging. Contact us to initiate a return.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer COD across Pakistan. You pay when your order arrives at your doorstep.' },
  { q: 'Are your products safe for children?', a: 'Absolutely! All products are tested for child safety and comply with international safety standards. No harmful chemicals.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll reply within 24 hours 📬');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-candy-blue to-candy-purple py-16 px-4 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="font-display text-5xl text-white mb-3">Get in Touch</h1>
        <p className="text-white/80 font-semibold text-lg">We'd love to hear from you. Our team is always here to help!</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map(({ icon: Icon, label, value, sub, color }, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 shadow-soft text-center hover:-translate-y-1 transition-transform">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-bold text-gray-800 text-sm">{value}</p>
              <p className="text-gray-400 text-xs font-semibold">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-soft p-6">
            <h2 className="font-display text-2xl text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Sara Ahmed" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="sara@example.com" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us how we can help you..." className="input-field h-32 resize-none" required />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-70">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  : <><FiSend className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-display text-2xl text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-800 hover:text-candy-purple transition-colors">
                    <span className="text-sm pr-4">{faq.q}</span>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-pastel-purple text-candy-purple flex items-center justify-center text-xs font-black transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm font-semibold text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-3xl p-5 flex items-center gap-4">
              <div className="text-4xl">💬</div>
              <div>
                <p className="font-bold text-green-800">Chat on WhatsApp</p>
                <p className="text-green-600 font-semibold text-sm">Get instant answers from our team</p>
              </div>
              <a href="https://wa.me/923211234567" target="_blank" rel="noopener noreferrer"
                className="ml-auto bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-green-600 transition-colors whitespace-nowrap">
                Chat Now →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
