'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDatabase } from '@/lib/seed';
import { Database, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await seedDatabase();
      setResult(res);
    } catch (err) {
      setResult({ success: false, message: 'Bir hata oluştu' });
      console.error('Seed error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Veritabanı Başlatma</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Örnek Veri Ekle
            </CardTitle>
            <CardDescription>
              Veritabanınıza örnek fiyat tipleri ve ürünler ekler. Bu işlem yalnızca bir kez yapılmalıdır.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Uyarı:</strong> Bu işlem şunları ekler:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
                <li>3 fiyat tipi (Perakende, Toptan, VIP)</li>
                <li>6 örnek ürün (içecekler)</li>
              </ul>
              <p className="text-sm text-yellow-800 mt-2">
                Eğer veritabanınızda zaten fiyat tipleri varsa bu işlem çalışmayacaktır.
              </p>
            </div>

            {result && (
              <div className={`flex items-center gap-2 p-4 rounded-md ${
                result.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            <Button 
              onClick={handleSeed} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Ekleniyor...' : 'Örnek Verileri Ekle'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
