import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Storefront() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      product.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchCategory = !selectedCategory || product.category === selectedCategory
    return matchSearch && matchCategory
  })

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
      {/* Search & Filter Section */}
      <section className="search-section">
        <h2 className="section-title">Shop</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
            }}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="category-showcase">
        <h2 className="section-title">Shop by category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div
              key={category}
              className="category-card"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="category-card-content">
                <div className="category-icon">📦</div>
              </div>
              <div className="category-label">
                {category} ({grouped[category].length})
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products by Category Section */}
      <section className="all-products">
        <h2 className="section-title">
          {selectedCategory ? `${selectedCategory}` : 'All products'}
        </h2>
        {filteredProducts.length === 0 ? (
          <div className="no-results">No products found matching your search.</div>
        ) : selectedCategory ? (
          // Show single category
          <div className="products-grid">
            {filteredProducts.map((product) => (
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
        ) : (
          // Show all categories with sections
          <>
            {categories.map((category, index) => {
              const categoryProducts = grouped[category]
              return (
                <div key={category}>
                  <h3 className="category-section-title">{category}</h3>
                  <div className="products-grid">
                    {categoryProducts.map((product) => (
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
                  {index < categories.length - 1 && <div className="category-divider" />}
                </div>
              )
            })}
          </>
        )}
      </section>
    </div>
  )
}

export default Storefront
