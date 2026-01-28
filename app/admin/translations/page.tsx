'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTranslation } from '@/contexts/TranslationContext';
import { Language, Translation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export default function TranslationsPage() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('uz');
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'translations', selectedLanguage);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setTranslations(docSnap.data() as Translation);
      } else {
        setTranslations({});
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (key: string) => {
    try {
      setSaving(true);
      const updatedTranslations = { ...translations, [key]: editValue };
      await setDoc(doc(db, 'translations', selectedLanguage), updatedTranslations);
      setTranslations(updatedTranslations);
      setEditingKey(null);
      setEditValue('');
    } catch (error) {
      console.error('Error saving translation:', error);
      alert('Error saving translation');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete translation key "${key}"?`)) return;

    try {
      setSaving(true);
      const updatedTranslations = { ...translations };
      delete updatedTranslations[key];
      await setDoc(doc(db, 'translations', selectedLanguage), updatedTranslations);
      setTranslations(updatedTranslations);
    } catch (error) {
      console.error('Error deleting translation:', error);
      alert('Error deleting translation');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = async () => {
    if (!newKey || !newValue) {
      alert('Please enter both key and value');
      return;
    }

    if (translations[newKey]) {
      alert('This key already exists');
      return;
    }

    try {
      setSaving(true);
      const updatedTranslations = { ...translations, [newKey]: newValue };
      await setDoc(doc(db, 'translations', selectedLanguage), updatedTranslations);
      setTranslations(updatedTranslations);
      setNewKey('');
      setNewValue('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding translation:', error);
      alert('Error adding translation');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('admin_translations')}</h1>
        <div className="flex gap-4 items-center">
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Translation
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Translation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newKey">Key</Label>
                <Input
                  id="newKey"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g., nav_home"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newValue">Value</Label>
                <Input
                  id="newValue"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Translation text"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddNew} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {t('admin_save')}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="mr-2 h-4 w-4" />
                {t('admin_cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">{t('loading')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(translations).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-mono text-sm">{key}</TableCell>
                    <TableCell>
                      {editingKey === key ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="max-w-md"
                        />
                      ) : (
                        <span>{value}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingKey === key ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(key)}
                            disabled={saving}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={saving}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(key, value)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
