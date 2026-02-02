import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a product image to Firebase Storage
 * @param file - The image file to upload
 * @returns Promise<string> - The download URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const filename = `${timestamp}_${randomString}_${file.name}`;
  
  // Create storage reference
  const storageRef = ref(storage, `products/${filename}`);
  
  // Upload file
  await uploadBytes(storageRef, file);
  
  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}
