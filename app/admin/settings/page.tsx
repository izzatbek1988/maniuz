'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface PriceType {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [selectedPriceTypeId, setSelectedPriceTypeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch price types
      const priceTypesSnapshot = await getDocs(collection(db, 'priceTypes'));
      const priceTypesData = priceTypesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setPriceTypes(priceTypesData);

      // Fetch current settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists() && settingsDoc.data().defaultPriceTypeId) {
        setSelectedPriceTypeId(settingsDoc.data().defaultPriceTypeId);
      } else if (priceTypesData.length > 0) {
        // Default to first price type if no setting exists
        setSelectedPriceTypeId(priceTypesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPriceTypeId) {
      toast.error(t('error'));
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        defaultPriceTypeId: selectedPriceTypeId,
      });
      toast.success(t('settings_saved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(t('error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('settings_title')}</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('settings_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultPriceType">{t('settings_default_price_type')}</Label>
            <Select
              value={selectedPriceTypeId}
              onValueChange={setSelectedPriceTypeId}
            >
              <SelectTrigger id="defaultPriceType">
                <SelectValue placeholder={t('settings_default_price_type')} />
              </SelectTrigger>
              <SelectContent>
                {priceTypes.map((priceType) => (
                  <SelectItem key={priceType.id} value={priceType.id}>
                    {priceType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={saving || !selectedPriceTypeId}>
            {saving ? t('loading') : t('settings_save')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
