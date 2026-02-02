'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, uploadProductImage } from '@/lib/firebase';
import { Product, PriceType } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    stock: 0,
    itemsPerBox: 1,
    pricePerUnit: 0,
    pricePerBox: 0,
    unitsPerBox: 1,
  });
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsSnap, priceTypesSnap] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'priceTypes')),
      ]);

      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setPriceTypes(priceTypesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceType)));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Lütfen bir resim dosyası seçin');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Resim boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!imageFile) {
      return formData.imageUrl;
    }

    setUploading(true);
    try {
      const downloadURL = await uploadProductImage(imageFile);
      toast.success('Resim başarıyla yüklendi!');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Resim yüklenirken hata oluştu');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload image if a new one is selected
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      const productData = {
        ...formData,
        imageUrl,
        prices,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        toast.success('Ürün güncellendi!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        toast.success('Ürün eklendi!');
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ürün kaydedilemedi');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
      itemsPerBox: product.itemsPerBox || 1,
      pricePerUnit: product.pricePerUnit || 0,
      pricePerBox: product.pricePerBox || 0,
      unitsPerBox: product.unitsPerBox || 1,
    });
    setPrices(product.prices);
    setImagePreview(product.imageUrl);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Ürün silindi!');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ürün silinemedi');
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      description: '', 
      imageUrl: '', 
      stock: 0, 
      itemsPerBox: 1,
      pricePerUnit: 0,
      pricePerBox: 0,
      unitsPerBox: 1,
    });
    setPrices({});
    clearImage();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ürün Yönetimi
          </h1>
          <p className="text-gray-600 mt-2">Ürünlerinizi yönetin, fiyatları güncelleyin ve resimler yükleyin</p>
        </div>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="shadow-xl border-purple-100 animate-slide-up">
          <CardHeader>
            <CardTitle>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ürün Adı *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemsPerBox">1 Kolide Kaç Adet? *</Label>
                  <Input
                    id="itemsPerBox"
                    type="number"
                    min="1"
                    value={formData.itemsPerBox}
                    onChange={(e) => setFormData({ ...formData, itemsPerBox: parseInt(e.target.value) || 1 })}
                    placeholder="Örnek: 24"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Örnek: Coca Cola 330ml için 24 adet = 1 koli
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stok (Koli) *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  required
                />
                {formData.itemsPerBox && formData.stock > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Toplam: <span className="font-semibold">{formData.stock * formData.itemsPerBox} adet</span>
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Ürün Resmi *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-md mx-auto">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={clearImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {imageFile && (
                        <p className="text-sm text-center text-muted-foreground">
                          {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer text-primary hover:underline"
                        >
                          Resim Seç veya Sürükle
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Fallback URL input */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="imageUrl">veya Resim URL Girin</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      if (e.target.value && !imageFile) {
                        setImagePreview(e.target.value);
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Dual Pricing System */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  💰 İkili Fiyat Sistemi
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">🔢 Adet Fiyatı (so'm)</Label>
                    <Input
                      id="pricePerUnit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                      placeholder="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerBox">📦 Koli Fiyatı (so'm)</Label>
                    <Input
                      id="pricePerBox"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerBox}
                      onChange={(e) => setFormData({ ...formData, pricePerBox: parseFloat(e.target.value) || 0 })}
                      placeholder="24000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitsPerBox">📊 Koli Başına Adet</Label>
                    <Input
                      id="unitsPerBox"
                      type="number"
                      min="1"
                      value={formData.unitsPerBox}
                      onChange={(e) => setFormData({ ...formData, unitsPerBox: parseInt(e.target.value) || 1 })}
                      placeholder="24"
                    />
                  </div>
                </div>
                {formData.pricePerUnit > 0 && formData.unitsPerBox > 0 && (
                  <p className="text-sm text-blue-600">
                    💡 Önerilen koli fiyatı: {(formData.pricePerUnit * formData.unitsPerBox).toLocaleString()} so'm
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Fiyatlar (Her Fiyat Tipi İçin) *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {priceTypes.map((priceType) => (
                    <div key={priceType.id} className="space-y-2">
                      <Label htmlFor={`price-${priceType.id}`}>{priceType.name}</Label>
                      <Input
                        id={`price-${priceType.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={prices[priceType.id] || ''}
                        onChange={(e) => setPrices({ ...prices, [priceType.id]: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    editingProduct ? 'Güncelle' : 'Ekle'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card 
            key={product.id}
            className="shadow-lg hover:shadow-2xl transition-all duration-300 border-purple-100 hover:border-purple-300 animate-fade-in"
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                  <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <p className="text-sm mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-medium">
                      📦 Stok: {product.stock} koli
                    </span>
                    {product.itemsPerBox && (
                      <span className="text-muted-foreground">({product.stock * product.itemsPerBox} adet)</span>
                    )}
                  </p>
                  
                  {/* Dual Pricing Display */}
                  {(product.pricePerUnit || product.pricePerBox) && (
                    <div className="flex gap-4 mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      {product.pricePerUnit && (
                        <span className="text-sm font-medium flex items-center gap-1">
                          🔢 Adet: <span className="text-purple-700 font-bold">{product.pricePerUnit.toLocaleString()} so'm</span>
                        </span>
                      )}
                      {product.pricePerBox && product.unitsPerBox && (
                        <span className="text-sm font-medium flex items-center gap-1">
                          📦 Koli: <span className="text-blue-700 font-bold">{product.pricePerBox.toLocaleString()} so'm</span>
                          <span className="text-xs text-gray-500">({product.unitsPerBox} adet)</span>
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {priceTypes.map((pt) => (
                      <span key={pt.id} className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium text-gray-700 border border-gray-200">
                        {pt.name}: {product.prices[pt.id]?.toFixed(2) || '0.00'} {t('currency_symbol')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleEdit(product)}
                    className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => handleDelete(product.id)}
                    className="hover:shadow-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
