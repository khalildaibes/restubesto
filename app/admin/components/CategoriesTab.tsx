'use client'

import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/stores/language'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string
}

export function CategoriesTab() {
  const { language } = useLanguageStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchCategories()
  }, [language])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/categories?locale=${language}`)
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        const categoriesList = data.data.map((item: any) => {
          const attrs = item.attributes || item
          // Use documentId if available (Strapi v5 i18n), otherwise use id
          const documentId = item.documentId || item.id
          return {
            id: String(documentId),
            name: attrs.name || '',
            slug: attrs.slug || '',
            description: attrs.description || '',
            imageUrl: attrs.imageUrl || '',
          }
        })
        setCategories(categoriesList)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
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

  const handleSave = async (categoryData: Partial<Category>) => {
    try {
      let imageUrl = categoryData.imageUrl || ''

      // Upload image if a new file was selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const payload = {
        ...categoryData,
        imageUrl,
        locale: language,
      }

      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchCategories()
        setEditingCategory(null)
        setIsCreating(false)
        setImageFile(null)
        setImagePreview('')
      } else {
        const error = await response.json()
        alert(`Failed to save category: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCategories()
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
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
    return <div className="text-center py-12">Loading categories...</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
          <p className="text-gray-600 mt-1">Create, update, and manage categories</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingCategory({
              id: '',
              name: '',
              slug: '',
              description: '',
              imageUrl: '',
            })
            setImageFile(null)
            setImagePreview('')
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden">
            {category.imageUrl && (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Slug: {category.slug}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(category)
                    setIsCreating(false)
                    setImagePreview(category.imageUrl || '')
                    setImageFile(null)
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Form Modal */}
      {(editingCategory || isCreating) && (
        <CategoryForm
          category={editingCategory!}
          imagePreview={imagePreview}
          onSave={handleSave}
          onCancel={() => {
            setEditingCategory(null)
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

interface CategoryFormProps {
  category: Category
  imagePreview: string
  onSave: (category: Partial<Category>) => void
  onCancel: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  generateSlug: (name: string) => string
}

function CategoryForm({ category, imagePreview, onSave, onCancel, onImageChange, generateSlug }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>(category)
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    setFormData(category)
    setAutoSlug(true)
  }, [category])

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name })
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
            {category.id ? 'Edit Category' : 'Create New Category'}
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
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
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

