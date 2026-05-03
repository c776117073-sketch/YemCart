import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  orderBy,
  limit,
  startAfter,
  Query,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

// Product interfaces
export interface Product {
  id?: string
  title: string
  description: string
  price: number
  images: string[]
  sellerId: string
  sellerUsername: string
  createdAt: string
  updatedAt?: string
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Favorite {
  userId: string
  productId: string
  createdAt: string
}

// =========================
// PRODUCTS FUNCTIONS
// =========================

export const addProduct = async (sellerId: string, sellerUsername: string, productData: Omit<Product, 'id' | 'sellerId' | 'sellerUsername' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      sellerId,
      sellerUsername,
      createdAt: new Date().toISOString(),
    })
    return { id: docRef.id, success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const updateProduct = async (productId: string, sellerId: string, data: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', productId)
    const productDoc = await getDoc(productRef)

    if (!productDoc.exists()) {
      throw new Error('المنتج غير موجود')
    }

    if (productDoc.data().sellerId !== sellerId) {
      throw new Error('ليس لديك صلاحية لتعديل هذا المنتج')
    }

    await updateDoc(productRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const deleteProduct = async (productId: string, sellerId: string) => {
  try {
    const productRef = doc(db, 'products', productId)
    const productDoc = await getDoc(productRef)

    if (!productDoc.exists()) {
      throw new Error('المنتج غير موجود')
    }

    if (productDoc.data().sellerId !== sellerId) {
      throw new Error('ليس لديك صلاحية لحذف هذا المنتج')
    }

    await deleteDoc(productRef)
    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'products', productId))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product
    }
    return null
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getProductsByUser = async (sellerId: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), where('sellerId', '==', sellerId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts()
    return allProducts.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// =========================
// FAVORITES FUNCTIONS
// =========================

export const addToFavorites = async (userId: string, productId: string) => {
  try {
    const favRef = await addDoc(collection(db, 'favorites'), {
      userId,
      productId,
      createdAt: new Date().toISOString(),
    })
    return { id: favRef.id, success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const removeFromFavorites = async (userId: string, productId: string) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId), where('productId', '==', productId))
    const querySnapshot = await getDocs(q)

    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(db, 'favorites', document.id))
    }

    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data().productId)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const isFavorited = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId), where('productId', '==', productId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.length > 0
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// =========================
// STORAGE FUNCTIONS
// =========================

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const uploadProductImages = async (files: File[], sellerId: string): Promise<string[]> => {
  try {
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = `products/${sellerId}/${Date.now()}_${i}_${file.name}`
      const url = await uploadImage(file, path)
      urls.push(url)
    }
    return urls
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  try {
    const path = `profiles/${userId}/avatar_${Date.now()}`
    return await uploadImage(file, path)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const uploadCoverImage = async (file: File, userId: string): Promise<string> => {
  try {
    const path = `profiles/${userId}/cover_${Date.now()}`
    return await uploadImage(file, path)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// =========================
// STORES FUNCTIONS
// =========================

export const getStoreByUserId = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      throw new Error('المتجر غير موجود')
    }
    return { id: userId, ...userDoc.data() }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const getStoreProducts = async (userId: string): Promise<Product[]> => {
  try {
    return await getProductsByUser(userId)
  } catch (error: any) {
    throw new Error(error.message)
  }
}
