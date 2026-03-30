'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { categories } from '@/data/products';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [catList, setCatList] = useState(categories);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', emoji: '🎁', color: 'from-pink-400 to-rose-400' });

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      setCatList(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted');
    }
  };

  const handleEdit = (cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, description: cat.description, emoji: cat.emoji || '🎁', color: cat.color });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCat) {
      setCatList(prev => prev.map(c => c.id === editCat.id ? { ...c, ...form } : c));
      toast.success('Category updated!');
    } else {
      const newCat = { id: `cat-${Date.now()}`, slug: form.name.toLowerCase().replace(/\s+/g, '-'), count: 0, bg: 'bg-pastel-purple', image: '', ...form };
      setCatList(prev => [...prev, newCat]);
      toast.success('Category added!');
    }
    setShowForm(false);
    setEditCat(null);
    setForm({ name: '', description: '', emoji: '🎁', color: 'from-pink-400 to-rose-400' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl text-gray-800">Categories</h1>
        </div>
        <button onClick={() => { setShowForm(true); setEditCat(null); }} className="btn-primary text-sm flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {catList.map(cat => (
            <div key={cat.id} className="bg-white rounded-3xl shadow-soft overflow-hidden group">
              <div className={`h-28 bg-gradient-to-br ${cat.color} flex items-center justify-center text-5xl relative`}>
                {cat.emoji || '📁'}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(cat)} className="w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-blue-500 hover:bg-white">
                    <FiEdit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-xl bg-white/90 flex items-center justify-center text-red-400 hover:bg-white">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl text-gray-800 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 font-semibold mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-candy-purple bg-pastel-purple px-2 py-1 rounded-lg">
                    {cat.count}+ Products
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">/{cat.slug}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <button
            onClick={() => { setShowForm(true); setEditCat(null); }}
            className="border-2 border-dashed border-gray-300 rounded-3xl h-48 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-candy-purple hover:text-candy-purple transition-colors"
          >
            <FiPlus className="w-8 h-8" />
            <span className="font-bold text-sm">Add Category</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-display text-2xl text-gray-800">{editCat ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g. Accessories" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" placeholder="Short description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Emoji</label>
                    <input type="text" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="input-field text-2xl" placeholder="🎁" maxLength={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gradient</label>
                    <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="input-field text-sm">
                      <option value="from-pink-400 to-rose-400">Pink → Rose</option>
                      <option value="from-purple-400 to-violet-400">Purple → Violet</option>
                      <option value="from-blue-400 to-cyan-400">Blue → Cyan</option>
                      <option value="from-yellow-400 to-amber-400">Yellow → Amber</option>
                      <option value="from-green-400 to-emerald-400">Green → Emerald</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">{editCat ? 'Update' : 'Add'} Category</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
