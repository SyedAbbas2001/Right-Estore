'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faPenToSquare, faTrash, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { products } from '@/data/products';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productList, setProductList] = useState(products);
  const [form, setForm] = useState({
    name: '', price: '', originalPrice: '', category: 'garments',
    description: '', stock: '', ageGroup: '', gender: 'Unisex',
  });

  const filtered = productList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.category === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = id => {
    if (confirm('Delete this product?')) {
      setProductList(p => p.filter(x => x.id !== id));
      toast.success('Product deleted');
    }
  };

  const handleEdit = product => {
    setEditProduct(product);
    setForm({ name: product.name, price: product.price, originalPrice: product.originalPrice || '', category: product.category, description: product.description || '', stock: product.stock, ageGroup: product.ageGroup || '', gender: product.gender || 'Unisex' });
    setShowForm(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    toast.success(editProduct ? 'Product updated!' : 'Product added!');
    setShowForm(false);
    setEditProduct(null);
    setForm({ name: '', price: '', originalPrice: '', category: 'garments', description: '', stock: '', ageGroup: '', gender: 'Unisex' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl text-gray-800">Products</h1>
          <span className="bg-purple-100 text-purple-600 font-black text-xs px-2 py-1 rounded-full">{productList.length}</span>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setShowForm(true); setEditProduct(null); }} className="btn-primary text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" /> Add Product
        </motion.button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm font-semibold" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'garments', 'newborn', 'toys', 'stationery'].map(f => (
              <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black capitalize transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 sm:px-6 py-4">Product</th>
                  <th className="text-left px-5 sm:px-6 py-4">Category</th>
                  <th className="text-left px-5 sm:px-6 py-4">Price</th>
                  <th className="text-left px-5 sm:px-6 py-4">Stock</th>
                  <th className="text-left px-5 sm:px-6 py-4">Rating</th>
                  <th className="text-left px-5 sm:px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product, i) => (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="capitalize bg-purple-100 text-purple-700 text-xs font-black px-2 py-1 rounded-lg">{product.category}</span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <p className="font-bold text-gray-800 text-sm">Rs. {product.price.toLocaleString()}</p>
                      {product.originalPrice && <p className="text-xs text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</p>}
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className={`font-bold text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>{product.stock}</span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">⭐</span>
                        <span className="font-bold text-gray-700 text-sm">{product.rating}</span>
                        <span className="text-gray-400 text-xs">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                          <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-bold text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h2 className="font-display text-2xl text-gray-800">{editProduct ? 'Edit' : 'Add'} Product</h2>
                  <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Product Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g. Rainbow Unicorn Dress" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Price (Rs.) *</label>
                      <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" placeholder="1999" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Original Price (Rs.)</label>
                      <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="input-field" placeholder="2999" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Category *</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                        <option value="garments">Garments</option>
                        <option value="newborn">New Born</option>
                        <option value="toys">Toys</option>
                        <option value="stationery">Stationery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Stock *</label>
                      <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" placeholder="50" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Age Group</label>
                      <input type="text" value={form.ageGroup} onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value }))} className="input-field" placeholder="e.g. 2-8 Years" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Gender</label>
                      <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="input-field">
                        <option value="Unisex">Unisex</option>
                        <option value="Boys">Boys</option>
                        <option value="Girls">Girls</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Description</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field h-24 resize-none" placeholder="Product description..." />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline">Cancel</button>
                    <button type="submit" className="flex-1 btn-primary justify-center">{editProduct ? 'Update' : 'Add'} Product</button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
