'use client'

import { useState, useEffect } from 'react'
import { getUserFavorites, isFavorited, addToFavorites, removeFromFavorites } from '@/lib/db'

export const useFavorites = (userId: string | undefined) => {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const fetchFavorites = async () => {
      setLoading(true)
      try {
        const fav = await getUserFavorites(userId)
        setFavorites(fav)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [userId])

  const toggleFavorite = async (productId: string) => {
    if (!userId) return

    try {
      const isFav = favorites.includes(productId)
      if (isFav) {
        await removeFromFavorites(userId, productId)
        setFavorites(favorites.filter((id) => id !== productId))
      } else {
        await addToFavorites(userId, productId)
        setFavorites([...favorites, productId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const isFav = (productId: string) => favorites.includes(productId)

  return { favorites, loading, toggleFavorite, isFav }
}
