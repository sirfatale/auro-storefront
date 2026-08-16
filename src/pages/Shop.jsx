import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import ProductCard from '../components/ProductCard'

function Shop() {
  const { products, loading, error } = useProducts()
  const categories = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get('category') || ''
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const handleCategoryChange = (value) => {
    if (value) {
      setSearchParams({ category: value })
    } else {
      setSearchParams({})
    }
  }

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCategory = !selectedCategory || product.category === selectedCategory
      return matchSearch && matchCategory
    })

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result = [...result].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        break
      default:
        break
    }

    return result
  }, [products, searchTerm, selectedCategory, sortBy])

  return (
    <div className="container page-section">
      <div className="shop-header">
        <h1 className="shop-title">{selectedCategory || 'All Products'}</h1>
        <p className="shop-subtitle">
          Hand-picked tech, linked directly to Amazon.
        </p>
      </div>

      <div className="shop-controls">
        <div className="shop-controls-filters">
          <input
            type="text"
            className="shop-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="shop-select"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="shop-sort">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            className="shop-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="state-message">Loading products...</div>
      ) : error ? (
        <div className="state-message error">Error loading products: {error}</div>
      ) : (
        <>
          <p className="products-count">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? 's' : ''}
          </p>
          {filteredProducts.length === 0 ? (
            <div className="no-results">No products match your search.</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Shop
