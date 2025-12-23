'use client'

import { useState, useEffect } from 'react'
import { OrdersTab } from './components/OrdersTab'
import { MealsTab } from './components/MealsTab'
import { DrinksTab } from './components/DrinksTab'
import { IngredientsTab } from './components/IngredientsTab'
import { CategoriesTab } from './components/CategoriesTab'
import { LoginForm } from './components/LoginForm'
import { LanguageSwitcher } from '@/features/language/components/LanguageSwitcher'
import { AccessibilityMenu } from '@/features/accessibility/components'

type Tab = 'orders' | 'meals' | 'drinks' | 'categories' | 'ingredients'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const authenticated = sessionStorage.getItem('adminAuthenticated') === 'true'
    setIsAuthenticated(authenticated)
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated')
    sessionStorage.removeItem('adminUsername')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <AccessibilityMenu />
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('meals')}
                className={`${
                  activeTab === 'meals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Meals
              </button>
              <button
                onClick={() => setActiveTab('drinks')}
                className={`${
                  activeTab === 'drinks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Drinks
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`${
                  activeTab === 'ingredients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Ingredients
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'meals' && <MealsTab />}
        {activeTab === 'drinks' && <DrinksTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'ingredients' && <IngredientsTab />}
      </div>
    </div>
  )
}

