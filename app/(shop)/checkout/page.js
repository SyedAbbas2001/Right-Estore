'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck, faCreditCard, faMoneyBill, faCheck,
  faShieldHalved, faChevronRight, faMinus, faPlus, faLock
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

const steps = ['Cart', 'Information', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '', saveAddress: false,
  });

  const total = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = total >= 2000 ? 0 : 150;
  const grand = total + shipping;

  const inp = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const placeOrder = async () => {
    if (!form.firstName || !form.email || !form.phone || !form.address || !form.city) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const orderId = 'KS' + Date.now().toString().slice(-6);
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}&method=${payMethod}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🛒</div>
          <h2 className="font-display text-3xl text-gray-700 mb-4">Cart is empty</h2>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Logo + Steps */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl text-gray-800">
            Kiddy<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Shop</span>
          </Link>

          <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-1.5 ${i <= step ? 'text-purple-600' : 'text-gray-400'}`}>
                  <motion.div animate={{ scale: i === step ? 1.1 : 1 }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      i < step ? 'bg-purple-600 text-white' :
                      i === step ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-300' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                    {i < step ? <FontAwesomeIcon icon={faCheck} className="w-3 h-3" /> : i + 1}
                  </motion.div>
                  <span className="text-xs font-bold hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-colors ${i < step ? 'bg-purple-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Contact */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft">
              <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'firstName', label: 'First Name *', placeholder: 'Sara' },
                  { name: 'lastName', label: 'Last Name *', placeholder: 'Ahmed' },
                  { name: 'email', label: 'Email *', placeholder: 'sara@example.com', type: 'email', full: true },
                  { name: 'phone', label: 'Phone *', placeholder: '+92 300 1234567', type: 'tel', full: true },
                ].map(({ name, label, placeholder, type = 'text', full }) => (
                  <div key={name} className={full ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">{label}</label>
                    <input name={name} type={type} value={form[name]} onChange={inp} placeholder={placeholder} className="input-field" required />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft">
              <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">Street Address *</label>
                  <input name="address" value={form.address} onChange={inp} placeholder="House #, Street, Area" className="input-field" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">City *</label>
                    <select name="city" value={form.city} onChange={inp} className="input-field">
                      <option value="">Select City</option>
                      {['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-wide">Province</label>
                    <select name="province" value={form.province} onChange={inp} className="input-field">
                      <option value="">Select Province</option>
                      {['Sindh','Punjab','KPK','Balochistan','ICT'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="saveAddress" checked={form.saveAddress} onChange={inp} className="w-4 h-4 accent-purple-600" />
                  <span className="text-sm font-bold text-gray-700">Save this address for future orders</span>
                </label>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft">
              <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { val: 'cod', icon: faMoneyBill, label: 'Cash on Delivery', sub: 'Pay when your order arrives', iconBg: 'bg-green-100 text-green-600' },
                  { val: 'card', icon: faCreditCard, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, JazzCash, EasyPaisa', iconBg: 'bg-blue-100 text-blue-600' },
                ].map(({ val, icon, label, sub, iconBg }) => (
                  <motion.label key={val} whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${payMethod === val ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="pay" value={val} checked={payMethod === val} onChange={() => setPayMethod(val)} className="accent-purple-600" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-sm">{label}</p>
                      <p className="text-xs text-gray-400 font-semibold">{sub}</p>
                    </div>
                    {payMethod === val && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white flex-shrink-0">
                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.label>
                ))}

                <AnimatePresence>
                  {payMethod === 'card' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-3 space-y-3">
                        <input type="text" placeholder="Card Number" className="input-field text-sm" maxLength={19} />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="MM / YY" className="input-field text-sm" />
                          <input type="text" placeholder="CVV" className="input-field text-sm" maxLength={3} />
                        </div>
                        <input type="text" placeholder="Cardholder Name" className="input-field text-sm" />
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                          <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
                          Secured by Stripe. Your card info is safe.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft sticky top-24">
              <h2 className="font-display text-xl sm:text-2xl text-gray-800 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto scrollbar-hide">
                {items.map(item => (
                  <div key={item.cartId} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-xs truncate">{item.name}</p>
                      {item.size && <p className="text-[10px] text-gray-400 font-semibold">{item.size}</p>}
                      <p className="text-purple-600 font-black text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Subtotal</span><span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-black' : ''}>{shipping === 0 ? 'FREE 🎉' : `Rs. ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-gray-800 border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="font-display text-2xl text-purple-600">Rs. {grand.toLocaleString()}</span>
                </div>
              </div>

              <motion.button onClick={placeOrder} disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full mt-5 py-4 justify-center text-base disabled:opacity-70">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
                ) : (
                  <><FontAwesomeIcon icon={faTruck} className="w-4 h-4" /> Place Order — Rs. {grand.toLocaleString()}</>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 mt-3">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-400 font-semibold">100% Secure & Encrypted Checkout</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
