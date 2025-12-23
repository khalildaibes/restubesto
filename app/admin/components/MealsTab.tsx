'use client'

import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/stores/language'

interface Meal {
  id: string
  name: string
  description: string
  price: number
  calories?: number
  categorySlug: string
  imageUrl?: string
  ingredients?: number[]
  tags?: number[]
  available?: boolean
}

interface Category {
  id: string
  slug: string
  name: string
}

interface Ingredient {
  id: string
  name: string
  price: number
  isDefault: boolean
}

interface MealsTabProps {
  categorySlug?: string
  categoryName?: string
}

export function MealsTab({ categorySlug, categoryName }: MealsTabProps = {}) {
  const { language } = useLanguageStore()
  const [meals, setMeals] = useState<Meal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [sortMode, setSortMode] = useState<'default' | 'category' | `cat:${string}`>(
    categorySlug ? `cat:${categorySlug}` : 'default'
  )

  useEffect(() => {
    fetchMeals()
    fetchCategories()
    fetchIngredients()
  }, [language])

  const fetchMeals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/meals?locale=${language}`)
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        const totalMeals = data.data.length
        const mealsList = data.data
          .filter((item: any) => {
            // Filter out unpublished meals (deleted meals)
            const attrs = item.attributes || item
            const publishedAt = attrs.publishedAt
            const isPublished = publishedAt !== null && publishedAt !== undefined
            
            // Log for debugging
            if (!isPublished) {
              console.log('🚫 Filtering out unpublished meal:', {
                id: item.id,
                documentId: item.documentId,
                name: attrs.name,
                publishedAt,
                publishedAtType: typeof publishedAt,
              })
            }
            
            return isPublished
          })
          .map((item: any) => {
            const attrs = item.attributes || item
            // Use documentId if available (Strapi v5 i18n), otherwise use id
            const documentId = item.documentId || item.id
            return {
              id: String(documentId),
              name: attrs.name || '',
              description: attrs.description || '',
              price: attrs.price || 0,
              calories: attrs.calories,
              categorySlug: attrs.categorySlug || '',
              imageUrl: attrs.imageUrl || '',
              ingredients: attrs.ingredients?.data?.map((ing: any) => {
                // Use documentId for ingredient relations too
                return ing.documentId || ing.id
              }) || [],
              tags: attrs.tags?.data?.map((tag: any) => {
                // Use documentId for tag relations too
                return tag.documentId || tag.id
              }) || [],
              available: attrs.available !== undefined ? attrs.available : true,
            }
          })
        
        const filteredCount = mealsList.length
        if (totalMeals !== filteredCount) {
          console.log(`📊 Filtered meals: ${totalMeals} total, ${filteredCount} published, ${totalMeals - filteredCount} unpublished`)
        }
        
        setMeals(mealsList)
      }
    } catch (error) {
      console.error('Error fetching meals:', error)
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

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`/api/admin/ingredients?locale=${language}`)
      const data = await response.json()
      if (data.data && Array.isArray(data.data)) {
        const ingredientsList = data.data.map((item: any) => {
          const attrs = item.attributes || item
          return {
            id: String(item.id),
            name: attrs.name || '',
            price: attrs.price || 0,
            isDefault: attrs.isDefault || false,
          }
        })
        setIngredients(ingredientsList)
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error)
    }
  }

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) {
      console.log('⚠️ No image file provided for upload')
      return null
    }

    try {
      console.log('📤 Uploading image file:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      })

      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('📥 Upload response:', {
        success: data.success,
        hasImage: !!data.image,
        imageUrl: data.image?.url,
        fullResponse: data,
      })

      if (data.success && data.image?.url) {
        console.log('✅ Image uploaded successfully, URL:', data.image.url)
        return data.image.url
      } else {
        console.error('❌ Image upload failed or no URL returned:', data)
        return null
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error)
      return null
    }
  }

  const handleSave = async (mealData: Partial<Meal>) => {
    try {
      console.log('💾 Starting save process:', {
        hasImageFile: !!imageFile,
        currentImageUrl: mealData.imageUrl,
        editingMeal: !!editingMeal,
        mealId: editingMeal?.id,
      })

      let imageUrl: string | undefined = mealData.imageUrl

      // Upload image if a new file was selected (this overrides the existing imageUrl)
      if (imageFile) {
        console.log('📎 Image file detected, uploading...')
        const uploadedUrl = await handleImageUpload()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
          console.log('✅ New image uploaded and set as imageUrl:', uploadedUrl)
        } else {
          console.warn('⚠️ Image upload failed, keeping existing imageUrl:', imageUrl)
        }
      } else {
        console.log('ℹ️ No new image file selected, preserving existing imageUrl:', imageUrl)
      }

    const payload: any = {
      name: mealData.name,
      description: mealData.description,
      price: mealData.price,
      calories: mealData.calories,
      categorySlug: mealData.categorySlug,
      available: mealData.available !== undefined ? mealData.available : true,
      locale: language,
    }

    // Always include imageUrl if it has a value (preserve existing or use new)
    if (imageUrl !== undefined && imageUrl !== null && imageUrl !== '') {
      payload.imageUrl = imageUrl
      console.log('📸 Including imageUrl in payload:', imageUrl)
    } else {
      console.warn('⚠️ No imageUrl to include in payload (undefined, null, or empty)')
    }

    // Only include ingredients/tags if they exist
    if (mealData.ingredients && Array.isArray(mealData.ingredients)) {
      payload.ingredients = mealData.ingredients
    }
    if (mealData.tags && Array.isArray(mealData.tags)) {
      payload.tags = mealData.tags
    }

      const url = editingMeal 
        ? `/api/admin/meals/${editingMeal.id}`
        : '/api/admin/meals'
      
      const method = editingMeal ? 'PUT' : 'POST'

      console.log('📤 Sending meal data to API:', {
        url,
        method,
        payload: { 
          ...payload, 
          imageUrl: payload.imageUrl, // Always log the actual imageUrl
          ingredients: payload.ingredients?.length || 0, 
          tags: payload.tags?.length || 0 
        },
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

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type') || ''
      let result: any = {}
      
      if (contentType.includes('application/json')) {
        try {
          result = await response.json()
        } catch (parseError) {
          console.error('❌ Failed to parse JSON response:', parseError)
          const text = await response.text()
          console.error('Response text:', text.substring(0, 200))
          throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
        }
      } else {
        // If not JSON, try to get text
        const text = await response.text()
        console.warn('⚠️ Non-JSON response:', text.substring(0, 200))
        throw new Error(`Unexpected response format: ${response.statusText}`)
      }

      console.log('📦 Parsed result:', result)

      if (response.ok && result.success) {
        await fetchMeals()
        setEditingMeal(null)
        setIsCreating(false)
        setImageFile(null)
        setImagePreview('')
      } else {
        const errorMessage = result.message || result.error || `Server error: ${response.status} ${response.statusText}`
        console.error('❌ Failed to save meal:', errorMessage)
        alert(`Failed to save meal: ${errorMessage}`)
      }
    } catch (error) {
      console.error('❌ Error saving meal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to save meal: ${errorMessage}`)
    }
  }

  const handleToggleAvailable = async (meal: Meal) => {
    const newAvailableStatus = !(meal.available !== false)
    const action = newAvailableStatus ? 'make available' : 'make unavailable'
    
    if (!confirm(`Are you sure you want to ${action} this meal?`)) return

    try {
      console.log(`🔄 Toggling available status for meal:`, {
        mealId: meal.id,
        currentAvailable: meal.available,
        newAvailable: newAvailableStatus,
      })

      const payload = {
        name: meal.name,
        description: meal.description,
        price: meal.price,
        calories: meal.calories,
        categorySlug: meal.categorySlug,
        imageUrl: meal.imageUrl,
        available: newAvailableStatus,
        locale: language,
        ingredients: meal.ingredients || [],
        tags: meal.tags || [],
      }

      const response = await fetch(`/api/admin/meals/${meal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('📥 Toggle response:', {
        status: response.status,
        ok: response.ok,
        data,
      })

      if (response.ok && data.success) {
        console.log(`✅ Meal ${action} successfully, refreshing list...`)
        await fetchMeals()
      } else {
        const errorMessage = data.message || data.error || `Failed to ${action} meal`
        console.error('❌ Toggle failed:', {
          status: response.status,
          ok: response.ok,
          data,
          errorMessage,
        })
        alert(`Failed to ${action} meal: ${errorMessage}`)
      }
    } catch (error) {
      console.error('❌ Error toggling meal availability:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to ${action} meal: ${errorMessage}`)
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

  if (loading) {
    return <div className="text-center py-12">Loading meals...</div>
  }

  const categoryNameMap = categories.reduce<Record<string, string>>((acc, cat) => {
    acc[cat.slug] = cat.name
    return acc
  }, {})

  // Filter meals by category if categorySlug is provided
  const baseMeals = categorySlug
    ? meals.filter((meal) => meal.categorySlug === categorySlug)
    : meals

  const displayedMeals =
    categorySlug
      ? [...baseMeals].sort((a, b) => a.name.localeCompare(b.name))
      : sortMode === 'category'
        ? [...meals].sort((a, b) => {
            const aCat = categoryNameMap[a.categorySlug] || ''
            const bCat = categoryNameMap[b.categorySlug] || ''
            if (aCat === bCat) return a.name.localeCompare(b.name)
            return aCat.localeCompare(bCat)
          })
        : sortMode.startsWith('cat:')
          ? meals
              .filter((meal) => meal.categorySlug === sortMode.replace('cat:', ''))
              .sort((a, b) => a.name.localeCompare(b.name))
          : meals

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {categoryName ? `${categoryName} - Meals` : 'Meals Management'}
          </h2>
          <p className="text-gray-600 mt-1">
            {categoryName
              ? `Manage meals in ${categoryName} category`
              : 'Create, update, and manage meals'}
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingMeal({
              id: '',
              name: '',
              description: '',
              price: 0,
              categorySlug: '',
              imageUrl: '',
              ingredients: [],
              tags: [],
              available: true,
            })
            setImageFile(null)
            setImagePreview('')
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Meal
        </button>
      </div>

      {!categorySlug && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Sort</label>
          <select
            value={sortMode}
            onChange={(e) =>
              setSortMode(
                e.target.value as 'default' | 'category' | `cat:${string}`
              )
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="default">Default order</option>
            <option value="category">Category (A → Z)</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={`cat:${cat.slug}`}>
                {`Category: ${cat.name}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMeals.map((meal) => (
          <div key={meal.id} className="bg-white rounded-lg shadow overflow-hidden">
            {meal.imageUrl && (
              <img
                src={meal.imageUrl}
                alt={meal.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  meal.available !== false
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {meal.available !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{meal.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-900">₪{meal.price.toFixed(2)}</span>
                {meal.calories && (
                  <span className="text-sm text-gray-500">{meal.calories} cal</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingMeal({
                      ...meal,
                      available: meal.available !== false, // Ensure boolean
                    })
                    setIsCreating(false)
                    setImagePreview(meal.imageUrl || '')
                    setImageFile(null)
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleAvailable(meal)}
                  className={`px-3 py-2 text-white text-sm rounded-md ${
                    meal.available !== false
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  title={meal.available !== false ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {meal.available !== false ? 'Unavailable' : 'Available'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meal Form Modal */}
      {(editingMeal || isCreating) && (
        <MealForm
          meal={editingMeal!}
          categories={categories}
          ingredients={ingredients}
          imagePreview={imagePreview}
          onSave={handleSave}
          onCancel={() => {
            setEditingMeal(null)
            setIsCreating(false)
            setImageFile(null)
            setImagePreview('')
          }}
          onImageChange={handleImageChange}
        />
      )}
    </div>
  )
}

interface MealFormProps {
  meal: Meal
  categories: Category[]
  ingredients: Ingredient[]
  imagePreview: string
  onSave: (meal: Partial<Meal>) => void
  onCancel: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function MealForm({ meal, categories, ingredients, imagePreview, onSave, onCancel, onImageChange }: MealFormProps) {
  const [formData, setFormData] = useState<Partial<Meal>>(meal)

  // Update formData when meal prop changes (e.g., when editing a different meal)
  useEffect(() => {
    setFormData(meal)
  }, [meal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {meal.id ? 'Edit Meal' : 'Create New Meal'}
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
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
              Uncheck to mark this meal as out of stock
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              {ingredients.map((ing) => (
                <label key={ing.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formData.ingredients?.includes(Number(ing.id)) || false}
                    onChange={(e) => {
                      const current = formData.ingredients || []
                      if (e.target.checked) {
                        setFormData({ ...formData, ingredients: [...current, Number(ing.id)] })
                      } else {
                        setFormData({ ...formData, ingredients: current.filter(id => id !== Number(ing.id)) })
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{ing.name} (₪{ing.price.toFixed(2)})</span>
                </label>
              ))}
            </div>
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

