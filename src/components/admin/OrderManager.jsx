import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Package, Clock, CheckCircle, Truck, Home, AlertCircle, Search, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const OrderManager = () => {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token')
      const response = await fetch('/api/orders?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data?.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token')
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchOrders() // Refresh orders
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token')
      const response = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payment_status: newPaymentStatus })
      })

      if (response.ok) {
        await fetchOrders() // Refresh orders
      } else {
        console.error('Failed to update payment status')
      }
    } catch (error) {
      console.error('Failed to update payment status:', error)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        color: 'bg-yellow-50 text-yellow-800 border-yellow-200', 
        icon: Clock, 
        text: t('orderStatus.pending.text'),
        nextActions: ['confirmed']
      },
      confirmed: { 
        color: 'bg-blue-50 text-blue-800 border-blue-200', 
        icon: CheckCircle, 
        text: t('orderStatus.confirmed.text'),
        nextActions: ['processing']
      },
      processing: { 
        color: 'bg-purple-50 text-purple-800 border-purple-200', 
        icon: Package, 
        text: t('orderStatus.processing.text'),
        nextActions: ['shipped']
      },
      shipped: { 
        color: 'bg-green-50 text-green-800 border-green-200', 
        icon: Truck, 
        text: t('orderStatus.shipped.text'),
        nextActions: ['delivered']
      },
      delivered: { 
        color: 'bg-green-100 text-green-900 border-green-300', 
        icon: Home, 
        text: t('orderStatus.delivered.text'),
        nextActions: []
      },
      cancelled: { 
        color: 'bg-red-50 text-red-800 border-red-200', 
        icon: AlertCircle, 
        text: t('orderStatus.cancelled.text'),
        nextActions: []
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-50 text-yellow-800 border-yellow-200', text: t('paymentStatus.pending') },
      paid: { color: 'bg-green-50 text-green-800 border-green-200', text: t('paymentStatus.paid') },
      failed: { color: 'bg-red-50 text-red-800 border-red-200', text: t('paymentStatus.failed') },
      refunded: { color: 'bg-gray-50 text-gray-800 border-gray-200', text: t('paymentStatus.refunded') }
    }
    return statusMap[status] || statusMap.pending
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`
    }
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  const paymentStatuses = ['pending', 'paid', 'failed', 'refunded']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900">{t('admin.orders.title')}</h2>
          <Button 
            onClick={fetchOrders} 
            disabled={loading}
            className="flex items-center gap-2 text-lg px-6 py-3"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? t('admin.orders.loading') : t('admin.orders.refresh')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-900">{t('admin.orders.searchAndFilter')}</h3>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={t('admin.orders.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">{t('admin.orders.allStatuses')}</option>
            <option value="pending">{t('orderStatus.pending.text')}</option>
            <option value="confirmed">{t('orderStatus.confirmed.text')}</option>
            <option value="processing">{t('orderStatus.processing.text')}</option>
            <option value="shipped">{t('orderStatus.shipped.text')}</option>
            <option value="delivered">{t('orderStatus.delivered.text')}</option>
            <option value="cancelled">{t('orderStatus.cancelled.text')}</option>
          </select>
        </div>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-2xl text-gray-600">{t('admin.orders.loading')}</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-12 text-center shadow-lg">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-2xl text-gray-500">{t('admin.orders.noOrdersFound')}</p>
          <p className="text-gray-400 mt-2">{t('admin.orders.adjustFilters')}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const paymentInfo = getPaymentStatusInfo(order.payment_status)
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={order.id} className="p-8 shadow-lg hover:shadow-xl transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('admin.orders.orderNumber')}：{order.order_number}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
                      <div>
                        <p><span className="font-bold">{t('admin.orders.customerName')}：</span>{order.customer_name}</p>
                        <p><span className="font-bold">{t('admin.orders.customerEmail')}：</span>{order.customer_email}</p>
                      </div>
                      <div>
                        <p><span className="font-bold">{t('admin.orders.customerPhone')}：</span>{order.customer_phone || t('admin.orders.notProvided')}</p>
                        <p><span className="font-bold">{t('admin.orders.orderDate')}：</span>{formatDate(order.created)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg text-gray-600 mb-2">{t('admin.orders.orderTotal')}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(order.total_amount, order.currency)}
                    </p>
                  </div>
                </div>

                {/* Status Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold mb-4 text-gray-900">{t('admin.orders.orderStatus')}</h4>
                    <div className="mb-4">
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${statusInfo.color}`}>
                        <StatusIcon className="h-6 w-6" />
                        <span className="text-lg font-bold">{statusInfo.text}</span>
                      </div>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">{t('orderStatus.pending.text')}</option>
                      <option value="confirmed">{t('orderStatus.confirmed.text')}</option>
                      <option value="processing">{t('orderStatus.processing.text')}</option>
                      <option value="shipped">{t('orderStatus.shipped.text')}</option>
                      <option value="delivered">{t('orderStatus.delivered.text')}</option>
                      <option value="cancelled">{t('orderStatus.cancelled.text')}</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold mb-4 text-gray-900">{t('admin.orders.paymentStatus')}</h4>
                    <div className="mb-4">
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${paymentInfo.color}`}>
                        <span className="text-lg font-bold">{paymentInfo.text}</span>
                      </div>
                    </div>
                    <select
                      value={order.payment_status}
                      onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">{t('paymentStatus.pending')}</option>
                      <option value="paid">{t('paymentStatus.paid')}</option>
                      <option value="failed">{t('paymentStatus.failed')}</option>
                      <option value="refunded">{t('paymentStatus.refunded')}</option>
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t-2 pt-6">
                  <h4 className="text-xl font-bold mb-4 text-gray-900">{t('admin.orders.orderItems')}</h4>
                  <div className="space-y-3 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg border">
                        <div className="flex-1">
                          <span className="text-lg font-medium text-gray-900">
                            {item.product_name}
                          </span>
                          <span className="text-lg text-gray-600 ml-4">
                            {t('admin.orders.quantity')}：{item.quantity}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(item.subtotal, order.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {order.shipping_address && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="text-lg font-bold mb-2 text-gray-900">{t('admin.orders.shippingAddress')}</h5>
                      <p className="text-lg text-gray-700">{order.shipping_address}</p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderManager