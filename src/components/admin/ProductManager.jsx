import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Plus, Edit, Trash2, Search, Eye, Package, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      toast.success('Product deleted successfully')
      logAction('delete', 'product', { productId })
      fetchProducts()
    } catch (error) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = {
    office: "辦公家具",
    living: "客廳家具",
    dining: "餐廳家具",
    bedroom: "臥室家具",
    outdoor: "戶外家具",
    kids: "兒童家具",
    storage: "收納整理",
    accent: "裝飾家具"
  }

  const categoryKeys = Object.keys(categories)

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={() => {
                setIsCreateModalOpen(false)
                fetchProducts()
              }}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categoryKeys.map(key => (
            <option key={key} value={key}>{categories[key]} ({key})</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.images && product.images[0] ? (
                          <img className="h-12 w-12 rounded-lg object-cover" src={product.images[0]} alt="" />
                        ) : product.image_url ? (
                          <img className="h-12 w-12 rounded-lg object-cover" src={product.image_url} alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.nameEn}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                        {product.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {categories[product.category] || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.inStock === true
                        ? 'bg-green-100 text-green-800'
                        : product.inStock === false
                        ? 'bg-red-100 text-red-800'
                        : product.stock_quantity > 10 
                        ? 'bg-green-100 text-green-800'
                        : product.stock_quantity > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock !== undefined 
                        ? (product.inStock ? 'In Stock' : 'Out of Stock')
                        : `${product.stock_quantity || 0} units`
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.is_featured 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_featured ? 'Featured' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                setEditingProduct(null)
                fetchProducts()
              }}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ProductForm({ product, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    nameEn: product?.nameEn || '',
    description: product?.description || '',
    descriptionEn: product?.descriptionEn || '',
    price: product?.price || '',
    category: product?.category || '',
    images: product?.images || [''],
    image_url: product?.image_url || '',
    stock_quantity: product?.stock_quantity || 0,
    inStock: product?.inStock !== undefined ? product.inStock : true,
    is_featured: product?.is_featured || false,
    rating: product?.rating || 0,
    reviews: product?.reviews || 0,
    specifications: {
      material: product?.specifications?.material || '',
      materialEn: product?.specifications?.materialEn || '',
      dimensions: product?.specifications?.dimensions || '',
      dimensionsEn: product?.specifications?.dimensionsEn || '',
      weight: product?.specifications?.weight || '',
      weightEn: product?.specifications?.weightEn || '',
      color: product?.specifications?.color || [],
      colorEn: product?.specifications?.colorEn || []
    }
  })
  
  const categories = {
    office: "辦公家具",
    living: "客廳家具",
    dining: "餐廳家具",
    bedroom: "臥室家具",
    outdoor: "戶外家具",
    kids: "兒童家具",
    storage: "收納整理",
    accent: "裝飾家具"
  }
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('adminToken')
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          rating: parseFloat(formData.rating) || 0,
          reviews: parseInt(formData.reviews) || 0
        })
      })

      if (response.ok) {
        toast.success(`Product ${product ? 'updated' : 'created'} successfully`)
        onSuccess()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Operation failed')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('spec_')) {
      const specField = name.replace('spec_', '')
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }))
    } else if (name === 'images') {
      const imageList = value.split('\n').filter(url => url.trim())
      setFormData(prev => ({
        ...prev,
        images: imageList
      }))
    } else if (name === 'colors' || name === 'colorsEn') {
      const colorField = name === 'colors' ? 'color' : 'colorEn'
      const colorList = value.split(',').map(c => c.trim()).filter(c => c)
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [colorField]: colorList
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Chinese)</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
            <Input
              name="nameEn"
              value={formData.nameEn}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>{value} ({key})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Chinese)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
          <textarea
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pricing & Stock</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <Input
              name="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="inStock"
              id="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
              In Stock
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Images</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
          <textarea
            name="images"
            value={formData.images.join('\n')}
            onChange={handleInputChange}
            rows={4}
            placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Single Image URL (fallback)</label>
          <Input
            name="image_url"
            type="url"
            value={formData.image_url}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Specifications</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material (Chinese)</label>
            <Input
              name="spec_material"
              value={formData.specifications.material}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material (English)</label>
            <Input
              name="spec_materialEn"
              value={formData.specifications.materialEn}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (Chinese)</label>
            <Input
              name="spec_dimensions"
              value={formData.specifications.dimensions}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (English)</label>
            <Input
              name="spec_dimensionsEn"
              value={formData.specifications.dimensionsEn}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (Chinese)</label>
            <Input
              name="spec_weight"
              value={formData.specifications.weight}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (English)</label>
            <Input
              name="spec_weightEn"
              value={formData.specifications.weightEn}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors (Chinese, comma-separated)</label>
            <Input
              name="colors"
              value={formData.specifications.color.join(', ')}
              onChange={handleInputChange}
              placeholder="黑色, 白色, 灰色"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors (English, comma-separated)</label>
            <Input
              name="colorsEn"
              value={formData.specifications.colorEn.join(', ')}
              onChange={handleInputChange}
              placeholder="Black, White, Gray"
            />
          </div>
        </div>
      </div>

      {/* Rating & Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Rating & Features</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <Input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
            <Input
              name="reviews"
              type="number"
              value={formData.reviews}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              name="is_featured"
              id="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Featured Product
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}