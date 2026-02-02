'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface PriceType {
  id: string;
  name: string;
}

interface ToastSettings {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration: 1000 | 2000 | 3000 | 5000; // ADDED: 1000ms (1 second)
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [selectedPriceTypeId, setSelectedPriceTypeId] = useState<string>('');
  const [toastSettings, setToastSettings] = useState<ToastSettings>({
    position: 'bottom-left',
    duration: 3000
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
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

        // Fetch toast settings
        const toastDoc = await getDoc(doc(db, 'settings', 'toast'));
        if (toastDoc.exists()) {
          setToastSettings(toastDoc.data() as ToastSettings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('error'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

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
      
      // Save toast settings
      await setDoc(doc(db, 'settings', 'toast'), toastSettings);
      
      toast.success(t('settings_saved'), {
        position: toastSettings.position,
        duration: toastSettings.duration
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(t('settings_error') || t('error'));
    } finally {
      setSaving(false);
    }
  };

  const handleTestToast = () => {
    toast.success(t('test_message'), {
      position: toastSettings.position,
      duration: toastSettings.duration
    });
  };

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('settings_title')}</h1>

      <div className="space-y-6">
        {/* Price Type Settings */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t('settings_default_price_type')}</CardTitle>
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
          </CardContent>
        </Card>

        {/* Toast Notification Settings */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t('toast_settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Position Settings */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t('toast_position')}
              </Label>
              <RadioGroup
                value={toastSettings.position}
                onValueChange={(value) => setToastSettings({ ...toastSettings, position: value as ToastSettings['position'] })}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-right" id="top-right" />
                    <Label htmlFor="top-right" className="cursor-pointer font-normal">
                      {t('top_right')} ↗️
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top-left" id="top-left" />
                    <Label htmlFor="top-left" className="cursor-pointer font-normal">
                      {t('top_left')} ↖️
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottom-right" id="bottom-right" />
                    <Label htmlFor="bottom-right" className="cursor-pointer font-normal">
                      {t('bottom_right')} ↘️
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottom-left" id="bottom-left" />
                    <Label htmlFor="bottom-left" className="cursor-pointer font-normal">
                      {t('bottom_left')} ↙️
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Duration Settings */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {t('toast_duration')}
              </Label>
              <RadioGroup
                value={toastSettings.duration.toString()}
                onValueChange={(value) => setToastSettings({ ...toastSettings, duration: parseInt(value) as ToastSettings['duration'] })}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1000" id="1s" />
                    <Label htmlFor="1s" className="cursor-pointer font-normal">
                      1 {t('second')} ⚡⚡
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2000" id="2s" />
                    <Label htmlFor="2s" className="cursor-pointer font-normal">
                      2 {t('seconds')} ⚡
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3000" id="3s" />
                    <Label htmlFor="3s" className="cursor-pointer font-normal">
                      3 {t('seconds')} ✅
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5000" id="5s" />
                    <Label htmlFor="5s" className="cursor-pointer font-normal">
                      5 {t('seconds')} 🕐
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 max-w-2xl">
          <Button
            onClick={handleTestToast}
            variant="outline"
          >
            {t('test_toast')} 🧪
          </Button>
          <Button onClick={handleSave} disabled={saving || !selectedPriceTypeId}>
            {saving ? t('saving') : t('save_settings')} 💾
          </Button>
        </div>
      </div>
    </div>
  );
}
