'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faPenToSquare, faTrash, faMagnifyingGlass, faXmark, faCloudArrowUp, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '', price: '', originalPrice: '', category: 'garments',
  description: '', stock: '', ageGroup: '', gender: 'Unisex',
  brand: '', sizes: '', colors: '', features: '', tags: '',
  isFeatured: false, isNew: false, badge: '', images: [],
};

export default function AdminProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const fileRef = useRef();

  const authHeaders = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.category === filter;
    return matchSearch && matchFilter;
  });

  const handleImageUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('images', f));

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm(f => ({ ...f, images: [...(f.images || []), ...data.urls] }));
      setPreviewImages(p => [...p, ...data.urls]);
      toast.success(`${data.urls.length} image(s) uploaded! ✅`);
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }));
    setPreviewImages(p => p.filter(i => i !== url));
  };

  const openAddForm = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setPreviewImages([]);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'garments',
      description: product.description || '',
      stock: product.stock || '',
      ageGroup: product.ageGroup || '',
      gender: product.gender || 'Unisex',
      brand: product.brand || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes || '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.colors || '',
      features: Array.isArray(product.features) ? product.features.join('\n') : product.features || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      badge: product.badge || '',
      images: product.images || [],
    });
    setPreviewImages(product.images || []);
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price and stock are required'); return; }
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      stock: parseInt(form.stock),
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      features: form.features ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    try {
      let res;
      if (editProduct) {
        res = await fetch(`/api/products/${editProduct.slug}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(payload) });
      } else {
        res = await fetch('/api/products', { method: 'POST', headers: authHeaders, body: JSON.stringify(payload) });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(editProduct ? 'Product updated! ✅' : 'Product added! ✅');
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${product.slug}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Product deleted');
      setProducts(p => p.filter(x => x._id !== product._id));
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl text-gray-800">Products</h1>
          <span className="bg-purple-100 text-purple-600 font-black text-xs px-2 py-1 rounded-full">{products.length}</span>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={openAddForm} className="btn-primary text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" /> Add Product
        </motion.button>
      </div>

      <div className="p-4 sm:p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-purple-400 text-sm font-semibold" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'garments', 'newborn', 'toys', 'stationery'].map(f => (
              <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black capitalize transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-4">Product</th>
                    <th className="text-left px-5 py-4">Category</th>
                    <th className="text-left px-5 py-4">Price</th>
                    <th className="text-left px-5 py-4">Stock</th>
                    <th className="text-left px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((product, i) => (
                    <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.images?.[0]
                              ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-400"><FontAwesomeIcon icon={faImage} className="w-5 h-5" /></div>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="capitalize bg-purple-100 text-purple-700 text-xs font-black px-2 py-1 rounded-lg">{product.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-800 text-sm">Rs. {product.price?.toLocaleString()}</p>
                        {product.originalPrice && <p className="text-xs text-gray-400 line-through">Rs. {product.originalPrice?.toLocaleString()}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-bold text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>{product.stock}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => openEditForm(product)}
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                            <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-bold text-gray-500">{products.length === 0 ? 'No products yet. Add your first product!' : 'No products found'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">

                <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h2 className="font-display text-2xl text-gray-800">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-3">Product Images</label>

                    {/* Upload area */}
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-purple-500 animate-spin" />
                          <p className="text-purple-600 font-bold text-sm">Uploading to Cloudinary...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FontAwesomeIcon icon={faCloudArrowUp} className="w-8 h-8 text-purple-400" />
                          <p className="text-purple-600 font-bold text-sm">Click to upload images</p>
                          <p className="text-gray-400 text-xs">PNG, JPG, WebP — Multiple images allowed</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                      onChange={e => handleImageUpload(e.target.files)} />

                    {/* Preview */}
                    {previewImages.length > 0 && (
                      <div className="flex gap-3 mt-3 flex-wrap">
                        {previewImages.map((url, i) => (
                          <div key={i} className="relative group">
                            <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200" />
                            <button type="button" onClick={() => removeImage(url)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Product Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="input-field" placeholder="e.g. Rainbow Unicorn Dress" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Price (Rs.) *</label>
                      <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        className="input-field" placeholder="1999" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Original Price (Rs.)</label>
                      <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                        className="input-field" placeholder="2999 (for discount)" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Category *</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                        <option value="garments">👗 Garments</option>
                        <option value="newborn">👶 New Born</option>
                        <option value="toys">🧸 Toys</option>
                        <option value="stationery">✏️ Stationery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Stock *</label>
                      <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                        className="input-field" placeholder="50" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Brand</label>
                      <input type="text" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                        className="input-field" placeholder="e.g. KiddyStyle" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Age Group</label>
                      <input type="text" value={form.ageGroup} onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value }))}
                        className="input-field" placeholder="e.g. 2-8 Years" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Gender</label>
                      <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="input-field">
                        <option value="Unisex">Unisex</option>
                        <option value="Boys">Boys</option>
                        <option value="Girls">Girls</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Badge Text</label>
                      <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                        className="input-field" placeholder="e.g. Bestseller, New, Hot" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="input-field h-24 resize-none" placeholder="Product description..." />
                  </div>

                  {/* Comma-separated fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Sizes <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                      <input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                        className="input-field" placeholder="2Y, 3Y, 4Y, 5Y" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Colors <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                      <input type="text" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                        className="input-field" placeholder="Pink, Blue, White" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                      <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                        className="input-field" placeholder="dress, girls, unicorn, party" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase mb-2">Features <span className="text-gray-400 font-normal">(one per line)</span></label>
                      <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                        className="input-field h-20 resize-none" placeholder="100% Soft Cotton&#10;Machine Washable&#10;Elastic Waistband" />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                        className="w-4 h-4 accent-purple-600" />
                      <span className="text-sm font-bold text-gray-700">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))}
                        className="w-4 h-4 accent-purple-600" />
                      <span className="text-sm font-bold text-gray-700">New Arrival</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline">Cancel</button>
                    <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="flex-1 btn-primary justify-center disabled:opacity-70">
                      {saving
                        ? <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin mr-2" />Saving...</>
                        : editProduct ? 'Update Product' : 'Add Product'}
                    </motion.button>
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
