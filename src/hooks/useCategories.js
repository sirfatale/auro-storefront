import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('active', true)

      if (error || cancelled) return

      const unique = [...new Set(data.map((p) => p.category))].sort()
      setCategories(unique)
    }

    fetchCategories()
    return () => {
      cancelled = true
    }
  }, [])

  return categories
}
