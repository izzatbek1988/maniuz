const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (requires service account credentials)
// For this script to work, you need to set GOOGLE_APPLICATION_CREDENTIALS env variable
// or provide credentials directly

let app;
try {
  app = initializeApp();
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.log('\nPlease set up Firebase Admin credentials:');
  console.log('1. Download service account JSON from Firebase Console');
  console.log('2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable');
  process.exit(1);
}

const db = getFirestore(app);

async function addItemsPerBox() {
  try {
    console.log('Starting itemsPerBox migration...');

    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach((doc) => {
      const product = doc.data();
      
      // If itemsPerBox doesn't exist, add default value of 24
      if (!product.itemsPerBox) {
        batch.update(doc.ref, { itemsPerBox: 24 });
        count++;
        console.log(`  Adding itemsPerBox to: ${product.name || doc.id}`);
      }
    });
    
    if (count > 0) {
      await batch.commit();
      console.log(`\n✅ Successfully added itemsPerBox to ${count} product(s)!`);
    } else {
      console.log('\n✅ All products already have itemsPerBox field.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addItemsPerBox();
