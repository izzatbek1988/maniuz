// Seed Data Script
// Run this script to populate your Firestore database with initial data
// Usage: node scripts/seed.js (after setting up Firebase)

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to add your service account key)
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Seed Price Types
    console.log('Adding price types...');
    const priceTypes = [
      {
        name: 'Perakende',
        description: 'Normal perakende satış fiyatı',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Toptan',
        description: 'Toptan satış fiyatı',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'VIP',
        description: 'VIP müşteriler için özel fiyat',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    const priceTypeRefs = [];
    for (const pt of priceTypes) {
      const ref = await db.collection('priceTypes').add(pt);
      priceTypeRefs.push({ id: ref.id, ...pt });
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
          [priceTypeRefs[0].id]: 8.50,  // Perakende
          [priceTypeRefs[1].id]: 7.00,  // Toptan
          [priceTypeRefs[2].id]: 6.50,  // VIP
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Red Bull Energy Drink 250ml',
        description: 'Red Bull enerji içeceği',
        imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34c1a86e?w=400',
        stock: 50,
        prices: {
          [priceTypeRefs[0].id]: 25.00,
          [priceTypeRefs[1].id]: 22.00,
          [priceTypeRefs[2].id]: 20.00,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Monster Energy 500ml',
        description: 'Monster enerji içeceği',
        imageUrl: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400',
        stock: 75,
        prices: {
          [priceTypeRefs[0].id]: 30.00,
          [priceTypeRefs[1].id]: 26.00,
          [priceTypeRefs[2].id]: 24.00,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Fanta Portakal 330ml',
        description: 'Portakal aromalı gazlı içecek',
        imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400',
        stock: 120,
        prices: {
          [priceTypeRefs[0].id]: 8.00,
          [priceTypeRefs[1].id]: 6.50,
          [priceTypeRefs[2].id]: 6.00,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Sprite 330ml',
        description: 'Limon aromalı gazlı içecek',
        imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
        stock: 100,
        prices: {
          [priceTypeRefs[0].id]: 8.00,
          [priceTypeRefs[1].id]: 6.50,
          [priceTypeRefs[2].id]: 6.00,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        name: 'Ice Tea Şeftali 330ml',
        description: 'Şeftali aromalı soğuk çay',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        stock: 80,
        prices: {
          [priceTypeRefs[0].id]: 10.00,
          [priceTypeRefs[1].id]: 8.50,
          [priceTypeRefs[2].id]: 8.00,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const product of products) {
      await db.collection('products').add(product);
      console.log(`  ✓ Added product: ${product.name}`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Register a user with admin@maniuz.com (or your configured admin email)');
    console.log('2. Login and access the admin panel');
    console.log('3. Start managing your e-commerce store!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seed();
