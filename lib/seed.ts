import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function seedDatabase() {
  console.log('🌱 Starting seed...');

  try {
    // Check if price types already exist
    const priceTypesSnap = await getDocs(collection(db, 'priceTypes'));
    if (priceTypesSnap.size > 0) {
      console.log('⚠️ Database already seeded. Skipping...');
      return { success: false, message: 'Database already contains data' };
    }

    // Seed Price Types
    console.log('Adding price types...');
    const priceTypes = [
      {
        name: 'Perakende',
        description: 'Normal perakende satış fiyatı',
        createdAt: serverTimestamp(),
      },
      {
        name: 'Toptan',
        description: 'Toptan satış fiyatı',
        createdAt: serverTimestamp(),
      },
      {
        name: 'VIP',
        description: 'VIP müşteriler için özel fiyat',
        createdAt: serverTimestamp(),
      },
    ];

    const priceTypeIds: string[] = [];
    for (const pt of priceTypes) {
      const ref = await addDoc(collection(db, 'priceTypes'), pt);
      priceTypeIds.push(ref.id);
      console.log(`  ✓ Added price type: ${pt.name}`);
    }

    // Seed Products
    console.log('\nAdding products...');
    const products = [
      {
        name: 'Coca-Cola 330ml',
        description: 'Klasik Coca-Cola kutu içecek',
        imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        stock: 100,
        prices: {
          [priceTypeIds[0]]: 8.50,  // Perakende
          [priceTypeIds[1]]: 7.00,  // Toptan
          [priceTypeIds[2]]: 6.50,  // VIP
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'Red Bull Energy Drink 250ml',
        description: 'Red Bull enerji içeceği',
        imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34c1a86e?w=400',
        stock: 50,
        prices: {
          [priceTypeIds[0]]: 25.00,
          [priceTypeIds[1]]: 22.00,
          [priceTypeIds[2]]: 20.00,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'Monster Energy 500ml',
        description: 'Monster enerji içeceği',
        imageUrl: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400',
        stock: 75,
        prices: {
          [priceTypeIds[0]]: 30.00,
          [priceTypeIds[1]]: 26.00,
          [priceTypeIds[2]]: 24.00,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'Fanta Portakal 330ml',
        description: 'Portakal aromalı gazlı içecek',
        imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400',
        stock: 120,
        prices: {
          [priceTypeIds[0]]: 8.00,
          [priceTypeIds[1]]: 6.50,
          [priceTypeIds[2]]: 6.00,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'Sprite 330ml',
        description: 'Limon aromalı gazlı içecek',
        imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
        stock: 100,
        prices: {
          [priceTypeIds[0]]: 8.00,
          [priceTypeIds[1]]: 6.50,
          [priceTypeIds[2]]: 6.00,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: 'Ice Tea Şeftali 330ml',
        description: 'Şeftali aromalı soğuk çay',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        stock: 80,
        prices: {
          [priceTypeIds[0]]: 10.00,
          [priceTypeIds[1]]: 8.50,
          [priceTypeIds[2]]: 8.00,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    ];

    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
      console.log(`  ✓ Added product: ${product.name}`);
    }

    console.log('\n✅ Seed completed successfully!');
    return { success: true, message: 'Database seeded successfully!' };
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return { success: false, message: 'Error seeding database' };
  }
}
