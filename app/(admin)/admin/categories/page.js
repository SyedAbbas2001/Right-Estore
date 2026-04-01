'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faPenToSquare, faTrash, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const { token } = useAuthStore();
  const [catList, setCatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', emoji: '🎁', color: 'from-pink-400 to-rose-400' });

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCatList(data.categories || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${cat._id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Category deleted');
      setCatList(p => p.filter(c => c._id !== cat._id));
    } catch { toast.error('Delete failed'); }
  };

  const handleEdit = cat => {
    setEditCat(cat);
    setForm({ name: cat.name, description: cat.description || '', emoji: cat.emoji, color: cat.color });
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      let res;
      if (editCat) {
        res = await fetch(`/api/categories/${editCat._id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(form) });
      } else {
        res = await fetch('/api/categories', { method: 'POST', headers: authHeaders, body: JSON.stringify(form) });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editCat ? 'Category updated! ✅' : 'Category added! ✅');
      setShowForm(false);
      setEditCat(null);
      setForm({ name: '', description: '', emoji: '🎁', color: 'from-pink-400 to-rose-400' });
      fetchCategories();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl text-gray-800">Categories</h1>
          <span className="bg-purple-100 text-purple-600 font-black text-xs px-2 py-1 rounded-full">{catList.length}</span>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setShowForm(true); setEditCat(null); setForm({ name: '', description: '', emoji: '🎁', color: 'from-pink-400 to-rose-400' }); }}
          className="btn-primary text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" /> Add Category
        </motion.button>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            {catList.map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl shadow-soft overflow-hidden group">
                <div className={`h-28 bg-gradient-to-br ${cat.color} flex items-center justify-center text-5xl relative`}>
                  {cat.emoji}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(cat)} className="w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-blue-500 hover:bg-white shadow-md">
                      <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(cat)} className="w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-red-400 hover:bg-white shadow-md">
                      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl text-gray-800 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-3">{cat.description}</p>
                  <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">/{cat.slug}</span>
                </div>
              </motion.div>
            ))}

            <button onClick={() => { setShowForm(true); setEditCat(null); setForm({ name: '', description: '', emoji: '🎁', color: 'from-pink-400 to-rose-400' }); }}
              className="border-2 border-dashed border-gray-300 rounded-3xl h-48 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors">
              <FontAwesomeIcon icon={faPlus} className="w-8 h-8" />
              <span className="font-bold text-sm">Add Category</span>
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-display text-2xl text-gray-800">{editCat ? 'Edit' : 'Add'} Category</h2>
                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">Category Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field" placeholder="e.g. Accessories" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">Description</label>
                  <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="input-field" placeholder="Short description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">Emoji</label>
                    <input type="text" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                      className="input-field text-2xl text-center" placeholder="🎁" maxLength={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase mb-2">Gradient</label>
                    <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="input-field text-sm">
                      <option value="from-pink-400 to-rose-400">Pink → Rose</option>
                      <option value="from-purple-400 to-violet-500">Purple → Violet</option>
                      <option value="from-blue-400 to-cyan-400">Blue → Cyan</option>
                      <option value="from-yellow-400 to-amber-400">Yellow → Amber</option>
                      <option value="from-green-400 to-emerald-400">Green → Emerald</option>
                      <option value="from-orange-400 to-red-400">Orange → Red</option>
                    </select>
                  </div>
                </div>
                {/* Preview */}
                <div className={`h-20 rounded-2xl bg-gradient-to-br ${form.color} flex items-center justify-center gap-3`}>
                  <span className="text-3xl">{form.emoji}</span>
                  <span className="font-display text-xl text-white">{form.name || 'Preview'}</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline">Cancel</button>
                  <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 btn-primary justify-center disabled:opacity-70 flex items-center gap-2">
                    {saving ? <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />Saving...</> : `${editCat ? 'Update' : 'Add'} Category`}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
