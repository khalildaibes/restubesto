'use client'

import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/stores/language'

interface Drink {
  id: string
  name: string
  slug: string
  description: string
  price: number
  calories?: number
  volume?: string
  categorySlug: string
  imageUrl?: string
  available?: boolean
}

interface Category {
  id: string
  slug: string
  name: string
}

export function DrinksTab() {
  const { language } = useLanguageStore()
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchDrinks()
    fetchCategories()
  }, [language])

  const fetchDrinks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/drinks?locale=${language}`)
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        const drinksList = data.data.map((item: any) => {
          const attrs = item.attributes || item
          // Use documentId if available (Strapi v5 i18n), otherwise use id
          const documentId = item.documentId || item.id
          return {
            id: String(documentId),
            name: attrs.name || '',
            slug: attrs.slug || '',
            description: attrs.description || '',
            price: attrs.price || 0,
            calories: attrs.calories,
            volume: attrs.volume,
            categorySlug: attrs.categorySlug || '',
            imageUrl: attrs.imageUrl || '',
            available: attrs.available !== undefined ? attrs.available : true,
          }
        })
        setDrinks(drinksList)
      }
    } catch (error) {
      console.error('Error fetching drinks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?locale=${language}`)
      const data = await response.json()
      if (data.data && Array.isArray(data.data)) {
        const categoriesList = data.data.map((item: any) => {
          const attrs = item.attributes || item
          return {
            id: String(item.id),
            slug: attrs.slug || '',
            name: attrs.name || '',
          }
        })
        setCategories(categoriesList)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success && data.image?.url) {
        return data.image.url
      }
      return null
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleSave = async (drinkData: Partial<Drink>) => {
    try {
      let imageUrl = drinkData.imageUrl || ''

      // Upload image if a new file was selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      // Note: slug and volume fields don't exist in Strapi drinks collection, so we exclude them
      const { slug, volume, ...drinkDataWithoutInvalidFields } = drinkData
      
      const payload = {
        ...drinkDataWithoutInvalidFields,
        imageUrl,
        available: drinkData.available !== undefined ? drinkData.available : true,
        locale: language,
      }

      // Determine if we're creating or updating
      const isUpdate = !isCreating && editingDrink && editingDrink.id
      
      // Validate that we have an ID when updating
      if (!isCreating && (!editingDrink || !editingDrink.id)) {
        console.error('❌ Cannot update drink: missing ID or editingDrink', { 
          isCreating,
          editingDrink,
          editingDrinkId: editingDrink?.id 
        })
        alert('Error: Drink ID is missing. Please try again.')
        return
      }

      const url = isUpdate
        ? `/api/admin/drinks/${editingDrink.id}`
        : '/api/admin/drinks'
      
      const method = isUpdate ? 'PUT' : 'POST'

      console.log('📤 Sending drink data:', {
        url,
        method,
        editingDrinkId: editingDrink?.id,
        isCreating,
        payload,
      })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('📥 Response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
      })

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type') || ''
      let result: any = {}
      
      // Read response text once (can only read body once)
      const responseText = await response.text()
      
      if (contentType.includes('application/json')) {
        try {
          if (responseText.trim()) {
            result = JSON.parse(responseText)
          } else {
            console.warn('⚠️ Empty JSON response')
            result = { error: 'Empty response from server' }
          }
        } catch (parseError) {
          console.error('❌ Failed to parse JSON response:', parseError)
          console.error('Response text:', responseText.substring(0, 200))
          throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
        }
      } else {
        // If not JSON, use the text we already read
        console.warn('⚠️ Non-JSON response:', responseText.substring(0, 200))
        result = { error: `Unexpected response format: ${response.statusText}`, message: responseText }
      }

      console.log('📦 Parsed result:', result)

      if (response.ok && result.success) {
        await fetchDrinks()
        setEditingDrink(null)
        setIsCreating(false)
        setImageFile(null)
        setImagePreview('')
      } else {
        const errorMessage = result.message || result.error || `Server error: ${response.status} ${response.statusText}`
        console.error('❌ Failed to save drink:', errorMessage)
        alert(`Failed to save drink: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error saving drink:', error)
      alert('Failed to save drink')
    }
  }

  const handleDelete = async (drinkId: string) => {
    if (!confirm('Are you sure you want to delete this drink?')) return

    try {
      const response = await fetch(`/api/admin/drinks/${drinkId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchDrinks()
      } else {
        alert('Failed to delete drink')
      }
    } catch (error) {
      console.error('Error deleting drink:', error)
      alert('Failed to delete drink')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (loading) {
    return <div className="text-center py-12">Loading drinks...</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Drinks Management</h2>
          <p className="text-gray-600 mt-1">Create, update, and manage drinks</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingDrink({
              id: '',
              name: '',
              slug: '',
              description: '',
              price: 0,
              categorySlug: '',
              imageUrl: '',
              available: true,
            })
            setImageFile(null)
            setImagePreview('')
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Drink
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drinks.map((drink) => (
          <div key={drink.id} className="bg-white rounded-lg shadow overflow-hidden">
            {drink.imageUrl && (
              <img
                src={drink.imageUrl}
                alt={drink.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{drink.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  drink.available !== false
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {drink.available !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Category: {drink.categorySlug}</p>
              {drink.volume && (
                <p className="text-sm text-gray-500 mb-2">Size: {drink.volume}</p>
              )}
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{drink.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-900">₪{drink.price.toFixed(2)}</span>
                {drink.calories && (
                  <span className="text-sm text-gray-500">{drink.calories} cal</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingDrink({
                      ...drink,
                      available: drink.available !== false,
                    })
                    setIsCreating(false)
                    setImagePreview(drink.imageUrl || '')
                    setImageFile(null)
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(drink.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drink Form Modal */}
      {(editingDrink || isCreating) && (
        <DrinkForm
          drink={editingDrink!}
          categories={categories}
          imagePreview={imagePreview}
          onSave={handleSave}
          onCancel={() => {
            setEditingDrink(null)
            setIsCreating(false)
            setImageFile(null)
            setImagePreview('')
          }}
          onImageChange={handleImageChange}
          generateSlug={generateSlug}
        />
      )}
    </div>
  )
}

interface DrinkFormProps {
  drink: Drink
  categories: Category[]
  imagePreview: string
  onSave: (drink: Partial<Drink>) => void
  onCancel: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  generateSlug: (name: string) => string
}

function DrinkForm({ drink, categories, imagePreview, onSave, onCancel, onImageChange, generateSlug }: DrinkFormProps) {
  const [formData, setFormData] = useState<Partial<Drink>>(drink)
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    setFormData(drink)
    setAutoSlug(true)
  }, [drink])

  const handleNameChange = (name: string) => {
    if (autoSlug) {
      setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }))
    } else {
      setFormData(prev => ({ ...prev, name }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {drink.id ? 'Edit Drink' : 'Create New Drink'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value })
                  setAutoSlug(false)
                }}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoSlug}
                  onChange={(e) => {
                    setAutoSlug(e.target.checked)
                    if (e.target.checked && formData.name) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name || '') }))
                    }
                  }}
                  className="w-4 h-4"
                />
                Auto
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly identifier (auto-generated from name if enabled)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              required
              value={formData.categorySlug || ''}
              onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₪) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calories
              </label>
              <input
                type="number"
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || undefined })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume/Size
            </label>
            <input
              type="text"
              value={formData.volume || ''}
              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              placeholder="e.g., 330ml, 500ml, Large"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available !== false}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Available (In Stock)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ms-6">
              Uncheck to mark this drink as out of stock
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            {formData.imageUrl && !imagePreview && (
              <p className="text-xs text-gray-500 mt-1">Current: {formData.imageUrl}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


