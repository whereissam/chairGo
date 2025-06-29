import { Card } from '../ui/card'
import { Package, Users, TrendingUp, AlertTriangle } from 'lucide-react'

export function DashboardStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-gray-500">
        Failed to load dashboard stats
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts?.length || 0,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Recent Products',
      value: stats.recentProducts?.length || 0,
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      purple: 'text-purple-600 bg-purple-100'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {stats.recentProducts?.length > 0 ? (
              stats.recentProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    ${product.price}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent products</p>
            )}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {stats.lowStockProducts?.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">Product ID: {product.id}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    {product.stock_quantity} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">All products are well stocked</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}