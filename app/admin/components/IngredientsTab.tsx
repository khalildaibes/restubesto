'use client'

import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/stores/language'

interface Ingredient {
  id: string
  name: string
  price: number
  isDefault: boolean
}

export function IngredientsTab() {
  const { language } = useLanguageStore()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchIngredients()
  }, [language])

  const fetchIngredients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/ingredients?locale=${language}`)
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        const ingredientsList = data.data.map((item: any) => {
          const attrs = item.attributes || item
          // Use documentId if available (Strapi v5 i18n), otherwise use id
          const documentId = item.documentId || item.id
          return {
            id: String(documentId),
            name: attrs.name || '',
            price: attrs.price || 0,
            isDefault: attrs.isDefault || false,
          }
        })
        setIngredients(ingredientsList)
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (ingredientData: Partial<Ingredient>) => {
    try {
      const payload = {
        ...ingredientData,
        locale: language,
      }

      const url = editingIngredient 
        ? `/api/admin/ingredients/${editingIngredient.id}`
        : '/api/admin/ingredients'
      
      const method = editingIngredient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchIngredients()
        setEditingIngredient(null)
        setIsCreating(false)
      } else {
        const error = await response.json()
        alert(`Failed to save ingredient: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving ingredient:', error)
      alert('Failed to save ingredient')
    }
  }

  const handleDelete = async (ingredientId: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return

    try {
      const response = await fetch(`/api/admin/ingredients/${ingredientId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchIngredients()
      } else {
        alert('Failed to delete ingredient')
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error)
      alert('Failed to delete ingredient')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading ingredients...</div>
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ingredients Management</h2>
          <p className="text-gray-600 mt-1">Create, update, and manage ingredients</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingIngredient({
              id: '',
              name: '',
              price: 0,
              isDefault: false,
            })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Ingredient
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ingredient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₪{ingredient.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ingredient.isDefault 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ingredient.isDefault ? 'Default' : 'Optional'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingIngredient(ingredient)
                        setIsCreating(false)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingredient Form Modal */}
      {(editingIngredient || isCreating) && (
        <IngredientForm
          ingredient={editingIngredient!}
          onSave={handleSave}
          onCancel={() => {
            setEditingIngredient(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

interface IngredientFormProps {
  ingredient: Ingredient
  onSave: (ingredient: Partial<Ingredient>) => void
  onCancel: () => void
}

function IngredientForm({ ingredient, onSave, onCancel }: IngredientFormProps) {
  const [formData, setFormData] = useState<Partial<Ingredient>>(ingredient)
  const [nameEn, setNameEn] = useState('')
  const [nameHe, setNameHe] = useState('')
  const [nameAr, setNameAr] = useState('')

  useEffect(() => {
    // For now, we'll use the name as-is (Strapi i18n will handle it)
    // In a full implementation, you'd fetch the multilingual name
    setNameEn(ingredient.name || '')
  }, [ingredient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For i18n, we need to send name for each locale
    // This is a simplified version - in production, you'd handle all locales
    onSave({
      ...formData,
      name: nameEn, // This will be the name for the current locale
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {ingredient.id ? 'Edit Ingredient' : 'Create New Ingredient'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (English) *
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
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
                Type
              </label>
              <select
                value={formData.isDefault ? 'default' : 'optional'}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.value === 'default' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="optional">Optional</option>
                <option value="default">Default</option>
              </select>
            </div>
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

