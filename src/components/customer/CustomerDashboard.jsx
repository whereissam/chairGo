import React, { useState, useEffect } from 'react'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { useTranslation } from 'react-i18next'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Package, MapPin, User, LogOut, Clock, CheckCircle, Truck, Home } from 'lucide-react'

const CustomerDashboard = () => {
  const { user, logout, getAuthHeaders } = useCustomerAuth()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    } else if (activeTab === 'addresses') {
      fetchAddresses()
    }
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders/my-orders', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
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

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customer/addresses', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        color: 'bg-yellow-50 text-yellow-800 border-yellow-200', 
        icon: Clock, 
        text: t('orderStatus.pending.text'),
        description: t('orderStatus.pending.description')
      },
      confirmed: { 
        color: 'bg-blue-50 text-blue-800 border-blue-200', 
        icon: CheckCircle, 
        text: t('orderStatus.confirmed.text'),
        description: t('orderStatus.confirmed.description')
      },
      processing: { 
        color: 'bg-purple-50 text-purple-800 border-purple-200', 
        icon: Package, 
        text: t('orderStatus.processing.text'),
        description: t('orderStatus.processing.description')
      },
      shipped: { 
        color: 'bg-green-50 text-green-800 border-green-200', 
        icon: Truck, 
        text: t('orderStatus.shipped.text'),
        description: t('orderStatus.shipped.description')
      },
      delivered: { 
        color: 'bg-green-100 text-green-900 border-green-300', 
        icon: Home, 
        text: t('orderStatus.delivered.text'),
        description: t('orderStatus.delivered.description')
      },
      cancelled: { 
        color: 'bg-red-50 text-red-800 border-red-200', 
        icon: Clock, 
        text: t('orderStatus.cancelled.text'),
        description: t('orderStatus.cancelled.description')
      }
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
      return `$${amount.toLocaleString()} 美元`
    }
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('customer.dashboard.title')}</h1>
          <p className="text-xl text-gray-600">{t('customer.dashboard.welcome', { username: user?.username })}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-lg rounded-lg transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-blue-100 text-blue-800 font-bold shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="h-6 w-6" />
                  <span>{t('customer.dashboard.myOrders')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-lg rounded-lg transition-all ${
                    activeTab === 'addresses' 
                      ? 'bg-blue-100 text-blue-800 font-bold shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="h-6 w-6" />
                  <span>{t('customer.dashboard.addresses')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-lg rounded-lg transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-800 font-bold shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-6 w-6" />
                  <span>{t('customer.dashboard.profile')}</span>
                </button>
                <hr className="my-4" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-4 text-lg rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-6 w-6" />
                  <span>{t('customer.dashboard.signOut')}</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">{t('customer.orders.title')}</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-xl text-gray-600">{t('customer.orders.loading')}</div>
                  </div>
                ) : orders.length === 0 ? (
                  <Card className="p-12 text-center shadow-lg">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">{t('customer.orders.noOrders')}</p>
                    <p className="text-gray-400 mt-2">{t('customer.orders.noOrdersDescription')}</p>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <Card key={order.id} className="p-8 shadow-lg hover:shadow-xl transition-shadow">
                          {/* Order Header */}
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 gap-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {t('customer.orders.orderNumber')}：{order.order_number}
                              </h3>
                              <p className="text-lg text-gray-600">
                                {t('customer.orders.orderDate')}：{formatDate(order.created)}
                              </p>
                            </div>
                            
                            {/* Status and Price */}
                            <div className="flex flex-col items-start lg:items-end gap-3">
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${statusInfo.color}`}>
                                <StatusIcon className="h-5 w-5" />
                                <span className="text-lg font-bold">{statusInfo.text}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">{t('customer.orders.orderTotal')}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                  {formatCurrency(order.total_amount, order.currency)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Status Description */}
                          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg text-gray-700">{statusInfo.description}</p>
                          </div>
                          
                          {/* Order Items */}
                          <div className="border-t-2 pt-6">
                            <h4 className="text-xl font-bold mb-4 text-gray-900">{t('customer.orders.orderItems')}：</h4>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                                  <div className="flex-1">
                                    <span className="text-lg font-medium text-gray-900">
                                      {item.product_name}
                                    </span>
                                    <span className="text-lg text-gray-600 ml-3">
                                      {t('checkout.quantity')}：{item.quantity}
                                    </span>
                                  </div>
                                  <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(item.subtotal, order.currency)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">{t('customer.addresses.title')}</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-xl text-gray-600">{t('customer.addresses.loading')}</div>
                  </div>
                ) : addresses.length === 0 ? (
                  <Card className="p-12 text-center shadow-lg">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">{t('customer.addresses.noAddresses')}</p>
                    <p className="text-gray-400 mt-2">{t('customer.addresses.noAddressesDescription')}</p>
                    <Button className="mt-6 text-lg px-6 py-3">{t('customer.addresses.addAddress')}</Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <Card key={address.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {address.address_type === 'shipping' ? t('customer.addresses.shippingAddress') : t('customer.addresses.billingAddress')}
                          </h3>
                          {address.is_default && (
                            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                              {t('customer.addresses.defaultAddress')}
                            </span>
                          )}
                        </div>
                        <div className="text-lg text-gray-700 space-y-2">
                          <p className="font-medium">{address.first_name} {address.last_name}</p>
                          <p>{address.street_address}</p>
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                          <p>{address.country}</p>
                          {address.phone && <p className="text-blue-600">📞 {address.phone}</p>}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">{t('customer.profile.title')}</h2>
                <Card className="p-8 shadow-lg">
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <label className="block text-lg font-bold text-gray-700 mb-2">{t('customer.profile.username')}</label>
                      <p className="text-xl text-gray-900">{user?.username}</p>
                    </div>
                    <div className="border-b pb-4">
                      <label className="block text-lg font-bold text-gray-700 mb-2">{t('customer.profile.email')}</label>
                      <p className="text-xl text-gray-900">{user?.email}</p>
                    </div>
                    <div className="border-b pb-4">
                      <label className="block text-lg font-bold text-gray-700 mb-2">{t('customer.profile.accountType')}</label>
                      <p className="text-xl text-gray-900">
                        {user?.role === 'user' ? t('customer.profile.regularMember') : t('customer.profile.admin')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">{t('customer.profile.memberSince')}</label>
                      <p className="text-xl text-gray-900">{formatDate(user?.created)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard