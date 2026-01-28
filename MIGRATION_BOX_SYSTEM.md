# Migration Guide for Box System (Koli Sistemi)

## Overview
This PR introduces a box system (koli sistemi) where products are tracked in boxes/cases rather than individual items.

## Database Changes

### Product Schema Update
A new field `itemsPerBox` has been added to the Product interface:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  stock: number;        // NOW: Number of boxes (koli), not individual items
  itemsPerBox: number;  // NEW: Number of items per box (e.g., 24)
  prices: {
    [priceTypeId: string]: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Migration Required

### For Existing Products in Firestore

You need to add the `itemsPerBox` field to all existing products. You have two options:

#### Option 1: Update via Admin Panel
1. Go to Admin Panel → Products
2. Edit each product
3. Enter the "Items Per Box" value (e.g., 24 for most drinks)
4. Save

#### Option 2: Run Migration Script

Create and run this migration script:

```javascript
// scripts/migrate-products-add-itemsPerBox.js
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function migrateProducts() {
  console.log('Starting migration...');
  
  const productsSnapshot = await db.collection('products').get();
  
  const batch = db.batch();
  let count = 0;
  
  productsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    
    // Only update if itemsPerBox doesn't exist
    if (!data.itemsPerBox) {
      batch.update(doc.ref, {
        itemsPerBox: 24 // Default: 24 items per box for most drinks
      });
      count++;
      console.log(`Updating ${data.name} with itemsPerBox: 24`);
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`✅ Migration complete! Updated ${count} products.`);
  } else {
    console.log('✅ All products already have itemsPerBox field.');
  }
  
  process.exit(0);
}

migrateProducts().catch(console.error);
```

Run with:
```bash
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json node scripts/migrate-products-add-itemsPerBox.js
```

## Stock Interpretation

**IMPORTANT**: After migration, the `stock` field now represents the number of **boxes/cases**, not individual items.

Example:
- Before: `stock: 2400` (2400 individual cans)
- After: `stock: 100, itemsPerBox: 24` (100 boxes × 24 cans = 2400 cans)

If you had products with individual item counts, you may need to convert them:
```javascript
// Example conversion
const oldStock = 2400; // individual items
const itemsPerBox = 24;
const newStock = Math.floor(oldStock / itemsPerBox); // 100 boxes
```

## Display Changes

The system now displays stock in a more informative way:

- **Before**: "Stok: 2400"
- **After**: "Stok: 100 koli (2400 dona)"

This applies to:
- Product listing pages
- Product detail pages
- Cart page
- Order pages
- Admin product management

## Testing Checklist

After migration, verify:
- [ ] Admin panel shows itemsPerBox field for all products
- [ ] Product cards show "X koli (Y dona)" format
- [ ] Cart shows box quantity and total items
- [ ] Product detail page shows correct box/item counts
- [ ] Quantity selector works correctly
- [ ] Orders are created with correct quantities

## Rollback

If you need to rollback, you can:
1. Keep the `itemsPerBox` field (it won't break anything)
2. Revert the frontend code changes
3. The old display will simply show the `stock` field as before

Note: There's no need to remove `itemsPerBox` from Firestore as it won't affect the old code.
