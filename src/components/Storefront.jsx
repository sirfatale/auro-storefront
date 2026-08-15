import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Storefront() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const groupByCategory = (products) => {
    const groups = {}
    products.forEach((product) => {
      if (!groups[product.category]) {
        groups[product.category] = []
      }
      groups[product.category].push(product)
    })
    return groups
  }

  const grouped = groupByCategory(products)
  const categories = Object.keys(grouped).sort()

  if (loading) {
    return <div className="storefront-loading">Loading products...</div>
  }

  if (error) {
    return <div className="storefront-error">Error loading products: {error}</div>
  }

  if (products.length === 0) {
    return (
      <div className="storefront-empty">
        <p>No products available yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="storefront">
      {categories.map((category) => (
        <section key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="products-grid">
            {grouped[category].map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-name">{product.name}</div>
                <div className="product-price">
                  ${product.price.toFixed(2)}
                </div>
                {product.description && (
                  <div className="product-description">
                    {product.description}
                  </div>
                )}
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link"
                >
                  View on Amazon
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Storefront
