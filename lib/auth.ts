import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { auth } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
  'auth/user-not-found': 'المستخدم غير موجود',
  'auth/wrong-password': 'كلمة المرور غير صحيحة',
  'auth/email-already-in-use': 'البريد الإلكتروني مسجل بالفعل',
  'auth/weak-password': 'كلمة المرور ضعيفة جداً',
  'auth/operation-not-allowed': 'هذه العملية غير مسموحة',
  'auth/too-many-requests': 'عدد كبير جداً من محاولات الدخول',
  'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت',
  'EMAIL_NOT_VERIFIED': 'تحقق من بريدك الإلكتروني أولاً',
  'permission-denied': 'ليس لديك صلاحية للقيام بهذا الإجراء',
}

interface UserData {
  email: string
  username: string
  role: 'buyer' | 'seller'
  phone?: string
  bio?: string
  avatar?: string
  coverImage?: string
  emailVerified: boolean
  createdAt: string
}

// Set up persistent login
export const setupPersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence)
  } catch (error) {
    console.error('Error setting persistence:', error)
  }
}

// Register user with email and password
export const registerUser = async (
  email: string,
  password: string,
  username: string,
  role: 'buyer' | 'seller'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Send email verification
    await sendEmailVerification(user)

    // Create user document in Firestore
    const userData: UserData = {
      email,
      username,
      role,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    }

    await setDoc(doc(db, 'users', user.uid), userData)

    return { user, success: true }
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = AUTH_ERRORS[errorCode] || error.message
    throw new Error(errorMessage)
  }
}

// Login user with email and password
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user.emailVerified) {
      throw new Error(AUTH_ERRORS['EMAIL_NOT_VERIFIED'])
    }

    return { user, success: true }
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = AUTH_ERRORS[errorCode] || error.message
    throw new Error(errorMessage)
  }
}

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) {
      // Create new user document
      const userData: UserData = {
        email: user.email || '',
        username: user.displayName || user.email?.split('@')[0] || 'User',
        role: 'buyer',
        avatar: user.photoURL || undefined,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'users', user.uid), userData)
    }

    return { user, success: true }
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = AUTH_ERRORS[errorCode] || error.message
    throw new Error(errorMessage)
  }
}

// Resend email verification
export const resendEmailVerification = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
      return { success: true }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as UserData) : null
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

// Update user data in Firestore
export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, data, { merge: true })
    return { success: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
