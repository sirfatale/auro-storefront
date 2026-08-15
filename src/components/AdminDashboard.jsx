import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list')
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technology',
    price: '',
    description: '',
    affiliate_link: '',
    image_url: '',
    active: true,
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [fetchingImage, setFetchingImage] = useState(false)

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

    let finalCategory = formData.category
    if (formData.category === 'add-new' && newCategory.trim()) {
      finalCategory = newCategory.trim()
    }

    if (!formData.name || !finalCategory || !formData.price || !formData.affiliate_link) {
      showMessage('Please fill in all required fields')
      return
    }

    try {
      const dataToSubmit = { ...formData, category: finalCategory }

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(dataToSubmit)
          .eq('id', editingId)

        if (error) throw error
        showMessage('Product updated successfully!')
        setEditingId(null)
      } else {
        const { error } = await supabase
          .from('products')
          .insert([dataToSubmit])

        if (error) throw error
        showMessage('Product added successfully!')
      }

      setFormData({
        name: '',
        category: 'Technology',
        price: '',
        description: '',
        affiliate_link: '',
        image_url: '',
        active: true,
      })
      setNewCategory('')
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

  const fetchImageFromAmazon = async () => {
    if (!formData.affiliate_link) {
      showMessage('Please enter an Amazon affiliate link first')
      return
    }

    setFetchingImage(true)
    try {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/'
      const response = await fetch(corsProxy + formData.affiliate_link, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })

      if (!response.ok) throw new Error('Failed to fetch Amazon page')

      const html = await response.text()

      // Fetch image
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/)
      if (ogImageMatch && ogImageMatch[1]) {
        setFormData((prev) => ({
          ...prev,
          image_url: ogImageMatch[1],
        }))
        showMessage('Image fetched successfully!')
      } else {
        showMessage('Could not find image on Amazon page. You can paste the image URL manually.')
      }

      // Fetch price
      const priceMatch = html.match(/<span class="a-price-whole">([^<]+)<\/span>/)
      if (priceMatch && priceMatch[1]) {
        const price = priceMatch[1].replace(/[^0-9.]/g, '')
        if (price) {
          setFormData((prev) => ({
            ...prev,
            price: parseFloat(price),
          }))
        }
      }
    } catch (err) {
      showMessage('Error fetching from Amazon: ' + err.message)
    } finally {
      setFetchingImage(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      name: '',
      category: 'Technology',
      price: '',
      description: '',
      affiliate_link: '',
      image_url: '',
      active: true,
    })
    setNewCategory('')
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
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Technology">Technology</option>
                  <option value="Tools">Tools</option>
                  <option value="Electronics">Electronics</option>
                  {categories.map((cat) =>
                    !['Technology', 'Tools', 'Electronics'].includes(cat) && (
                      <option key={cat} value={cat}>{cat}</option>
                    )
                  )}
                  <option value="add-new">+ Add new category</option>
                </select>
              </div>

              {formData.category === 'add-new' && (
                <div className="form-group">
                  <label htmlFor="newCategory">New Category Name *</label>
                  <input
                    type="text"
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    required={formData.category === 'add-new'}
                  />
                </div>
              )}

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
                <label htmlFor="image_url">Product Image URL</label>
                <div className="image-input-group">
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="Image URL will appear here"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={fetchImageFromAmazon}
                    disabled={fetchingImage}
                  >
                    {fetchingImage ? 'Fetching...' : 'Fetch from Amazon'}
                  </button>
                </div>
                {formData.image_url && (
                  <div className="image-preview">
                    <img src={formData.image_url} alt="Product preview" />
                  </div>
                )}
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
