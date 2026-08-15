import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    affiliate_link: '',
    active: true,
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])

      const uniqueCategories = [...new Set(data?.map(p => p.category) || [])]
      setCategories(uniqueCategories.sort())
    } catch (err) {
      showMessage('Error loading products: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.affiliate_link) {
      showMessage('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        showMessage('Product updated successfully!')
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData])

        if (error) throw error
        showMessage('Product added successfully!')
      }

      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        affiliate_link: '',
        active: true,
      })
      setActiveTab('list')
      fetchProducts()
    } catch (err) {
      showMessage('Error: ' + err.message)
    }
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      affiliate_link: product.affiliate_link,
      active: product.active,
    })
    setEditingId(product.id)
    setActiveTab('add')
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      showMessage('Product deleted successfully!')
      fetchProducts()
    } catch (err) {
      showMessage('Error: ' + err.message)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      affiliate_link: '',
      active: true,
    })
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="dashboard-nav">
          <button
            className={`${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Product List
          </button>
          <button
            className={`${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('add')
              handleCancel()
            }}
          >
            {editingId ? 'Edit Product' : 'Add Product'}
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {activeTab === 'list' && (
          <div>
            <h2>Products</h2>
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p>No products yet. Start by adding one!</p>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.active ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div>
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category * (Type to create new or select existing)</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  list="categoryList"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Technology, Tools, Electronics, etc."
                  required
                />
                <datalist id="categoryList">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (USD) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional: Brief description of the product"
                />
              </div>

              <div className="form-group">
                <label htmlFor="affiliate_link">Amazon Affiliate Link *</label>
                <input
                  type="url"
                  id="affiliate_link"
                  name="affiliate_link"
                  value={formData.affiliate_link}
                  onChange={handleInputChange}
                  placeholder="https://amazon.com/..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="active">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                  Active (show on storefront)
                </label>
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
