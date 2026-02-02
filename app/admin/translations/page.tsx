'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTranslation } from '@/contexts/TranslationContext';
import { Language } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, X, Edit, Trash2, Languages } from 'lucide-react';

interface TranslationItem {
  key: string;
  uz: string;
  tr: string;
  ru: string;
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newTranslation, setNewTranslation] = useState<TranslationItem>({
    key: '',
    uz: '',
    tr: '',
    ru: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      
      // Fetch all 3 languages
      const translationsSnapshot = await getDocs(collection(db, 'translations'));
      
      const uzDoc = translationsSnapshot.docs.find(doc => doc.id === 'uz');
      const trDoc = translationsSnapshot.docs.find(doc => doc.id === 'tr');
      const ruDoc = translationsSnapshot.docs.find(doc => doc.id === 'ru');

      const uzData = uzDoc?.data() || {};
      const trData = trDoc?.data() || {};
      const ruData = ruDoc?.data() || {};

      // Combine all keys
      const allKeys = new Set([
        ...Object.keys(uzData),
        ...Object.keys(trData),
        ...Object.keys(ruData)
      ]);

      const combined: TranslationItem[] = Array.from(allKeys).map(key => ({
        key,
        uz: uzData[key] || '',
        tr: trData[key] || '',
        ru: ruData[key] || ''
      })).sort((a, b) => a.key.localeCompare(b.key));

      setTranslations(combined);
    } catch (error) {
      console.error('Error fetching translations:', error);
      alert('Error loading translations');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (item: TranslationItem) => {
    if (!item.key.trim()) {
      alert('Key cannot be empty!');
      return;
    }

    try {
      setSaving(true);
      
      // Get existing data
      const translationsSnapshot = await getDocs(collection(db, 'translations'));
      const uzDoc = translationsSnapshot.docs.find(d => d.id === 'uz');
      const trDoc = translationsSnapshot.docs.find(d => d.id === 'tr');
      const ruDoc = translationsSnapshot.docs.find(d => d.id === 'ru');

      const uzData = uzDoc?.data() || {};
      const trData = trDoc?.data() || {};
      const ruData = ruDoc?.data() || {};

      // Update with new key
      await setDoc(doc(db, 'translations', 'uz'), { ...uzData, [item.key]: item.uz });
      await setDoc(doc(db, 'translations', 'tr'), { ...trData, [item.key]: item.tr });
      await setDoc(doc(db, 'translations', 'ru'), { ...ruData, [item.key]: item.ru });

      alert('✅ Translation saved for all languages!');
      setEditingKey(null);
      setShowAddForm(false);
      setNewTranslation({ key: '', uz: '', tr: '', ru: '' });
      fetchTranslations();
      
      // Clear cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('maniuz_translations_uz');
        localStorage.removeItem('maniuz_translations_tr');
        localStorage.removeItem('maniuz_translations_ru');
      }
    } catch (error) {
      console.error('Error saving translation:', error);
      alert('Error saving translation');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete translation key: ${key}?`)) return;

    try {
      setSaving(true);
      
      const translationsSnapshot = await getDocs(collection(db, 'translations'));
      const uzDoc = translationsSnapshot.docs.find(d => d.id === 'uz');
      const trDoc = translationsSnapshot.docs.find(d => d.id === 'tr');
      const ruDoc = translationsSnapshot.docs.find(d => d.id === 'ru');

      const uzData = uzDoc?.data() || {};
      const trData = trDoc?.data() || {};
      const ruData = ruDoc?.data() || {};

      delete uzData[key];
      delete trData[key];
      delete ruData[key];

      await setDoc(doc(db, 'translations', 'uz'), uzData);
      await setDoc(doc(db, 'translations', 'tr'), trData);
      await setDoc(doc(db, 'translations', 'ru'), ruData);

      alert('✅ Translation deleted from all languages!');
      fetchTranslations();
      
      // Clear cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('maniuz_translations_uz');
        localStorage.removeItem('maniuz_translations_tr');
        localStorage.removeItem('maniuz_translations_ru');
      }
    } catch (error) {
      console.error('Error deleting translation:', error);
      alert('Error deleting translation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('admin_translations') || 'Tarjimalar'}
          </h1>
          <p className="text-gray-600 mt-1">
            {translations.length} translation keys
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showAddForm ? t('admin_cancel') || 'Bekor qilish' : 'Add Translation'}
        </Button>
      </div>

      {/* Add New Translation Form */}
      {showAddForm && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Languages className="h-5 w-5" />
              Add New Translation (All Languages)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Key <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
                  placeholder="example: home_welcome"
                  className="font-mono"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    🇺🇿 O&apos;zbek (uz)
                  </label>
                  <Input
                    value={newTranslation.uz}
                    onChange={(e) => setNewTranslation({ ...newTranslation, uz: e.target.value })}
                    placeholder="Uzbek translation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    🇹🇷 Türkçe (tr)
                  </label>
                  <Input
                    value={newTranslation.tr}
                    onChange={(e) => setNewTranslation({ ...newTranslation, tr: e.target.value })}
                    placeholder="Turkish translation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    🇷🇺 Русский (ru)
                  </label>
                  <Input
                    value={newTranslation.ru}
                    onChange={(e) => setNewTranslation({ ...newTranslation, ru: e.target.value })}
                    placeholder="Russian translation"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveAll(newTranslation)}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save All Languages'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTranslation({ key: '', uz: '', tr: '', ru: '' });
                  }}
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Translations Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Key</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">🇺🇿 O&apos;zbek</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">🇹🇷 Türkçe</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">🇷🇺 Русский</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {translations.map((item) => (
                    <tr key={item.key} className="border-b hover:bg-gray-50">
                      {editingKey === item.key ? (
                        <>
                          <td className="px-4 py-3">
                            <Input
                              value={item.key}
                              disabled
                              className="font-mono text-sm bg-gray-100"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={item.uz}
                              onChange={(e) => {
                                const updated = translations.map(t => 
                                  t.key === item.key ? { ...t, uz: e.target.value } : t
                                );
                                setTranslations(updated);
                              }}
                              className="text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={item.tr}
                              onChange={(e) => {
                                const updated = translations.map(t => 
                                  t.key === item.key ? { ...t, tr: e.target.value } : t
                                );
                                setTranslations(updated);
                              }}
                              className="text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={item.ru}
                              onChange={(e) => {
                                const updated = translations.map(t => 
                                  t.key === item.key ? { ...t, ru: e.target.value } : t
                                );
                                setTranslations(updated);
                              }}
                              className="text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveAll(item)}
                              disabled={saving}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingKey(null);
                                fetchTranslations();
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-mono text-sm text-gray-700">{item.key}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.uz || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.tr || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.ru || '—'}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingKey(item.key)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item.key)}
                              disabled={saving}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}