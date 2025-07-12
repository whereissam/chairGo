import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Package, Clock, CheckCircle, Truck, Home, AlertCircle, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const OrderTracking = () => {
  const { t } = useTranslation()
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchOrder = async () => {
    if (!orderNumber.trim()) {
      setError(t('orderTracking.enterOrderNumber'))
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/orders/number/${orderNumber.trim()}`)
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.data)
      } else {
        setError(t('orderTracking.notFound'))
        setOrder(null)
      }
    } catch (error) {
      setError(t('orderTracking.searchError'))
      setOrder(null)
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
        description: t('orderStatus.pending.description'),
        step: 1
      },
      confirmed: { 
        color: 'bg-blue-50 text-blue-800 border-blue-200', 
        icon: CheckCircle, 
        text: t('orderStatus.confirmed.text'),
        description: t('orderStatus.confirmed.description'),
        step: 2
      },
      processing: { 
        color: 'bg-purple-50 text-purple-800 border-purple-200', 
        icon: Package, 
        text: t('orderStatus.processing.text'),
        description: t('orderStatus.processing.description'),
        step: 3
      },
      shipped: { 
        color: 'bg-green-50 text-green-800 border-green-200', 
        icon: Truck, 
        text: t('orderStatus.shipped.text'),
        description: t('orderStatus.shipped.description'),
        step: 4
      },
      delivered: { 
        color: 'bg-green-100 text-green-900 border-green-300', 
        icon: Home, 
        text: t('orderStatus.delivered.text'),
        description: t('orderStatus.delivered.description'),
        step: 5
      },
      cancelled: { 
        color: 'bg-red-50 text-red-800 border-red-200', 
        icon: AlertCircle, 
        text: t('orderStatus.cancelled.text'),
        description: t('orderStatus.cancelled.description'),
        step: 0
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const StatusProgressBar = ({ currentStatus }) => {
    const steps = [
      { key: 'pending', text: t('orderStatus.pending.text'), icon: Clock },
      { key: 'confirmed', text: t('orderStatus.confirmed.text'), icon: CheckCircle },
      { key: 'processing', text: t('orderStatus.processing.text'), icon: Package },
      { key: 'shipped', text: t('orderStatus.shipped.text'), icon: Truck },
      { key: 'delivered', text: t('orderStatus.delivered.text'), icon: Home }
    ]

    const currentStatusInfo = getStatusInfo(currentStatus)
    const currentStep = currentStatusInfo.step

    if (currentStatus === 'cancelled') {
      return (
        <div className="text-center p-6">
          <div className="flex items-center justify-center gap-3 text-red-600">
            <AlertCircle className="h-8 w-8" />
            <span className="text-2xl font-bold">{t('orderStatus.cancelled.description')}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = index + 1 <= currentStep
            const isActive = index + 1 === currentStep
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  <StepIcon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-medium text-center ${
                  isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.text}
                </span>
                
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-6 left-1/2 w-full h-1 -z-10
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} style={{ 
                    transform: 'translateX(50%)',
                    width: `calc(100% / ${steps.length} - 48px)`,
                    marginLeft: '24px'
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('orderTracking.title')}</h1>
          <p className="text-xl text-gray-600">{t('orderTracking.subtitle')}</p>
        </div>

        {/* Search Box */}
        <Card className="p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t('orderTracking.searchPlaceholder')}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
                className="pl-10 text-lg py-3"
              />
            </div>
            <Button
              onClick={searchOrder}
              disabled={loading}
              className="text-lg px-8 py-3"
            >
              {loading ? t('orderTracking.searching') : t('orderTracking.searchButton')}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="p-8 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('admin.orders.orderNumber')}：{order.order_number}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                    <div>
                      <p><span className="font-bold text-gray-700">{t('orderTracking.customerName')}：</span>{order.customer_name}</p>
                      <p><span className="font-bold text-gray-700">{t('admin.orders.orderDate')}：</span>{formatDate(order.created)}</p>
                    </div>
                    <div>
                      <p><span className="font-bold text-gray-700">{t('admin.orders.orderTotal')}：</span>{formatCurrency(order.total_amount, order.currency)}</p>
                      <p><span className="font-bold text-gray-700">{t('orderTracking.paymentStatus')}：</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.payment_status === 'paid' ? t('paymentStatus.paid') :
                           order.payment_status === 'pending' ? t('paymentStatus.pending') :
                           order.payment_status === 'failed' ? t('paymentStatus.failed') : t('paymentStatus.refunded')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Progress */}
            <Card className="shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900">{t('orderTracking.orderProgress')}</h3>
              </div>
              <div className="relative">
                <StatusProgressBar currentStatus={order.status} />
              </div>
              
              {/* Current Status Description */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-center">
                  {(() => {
                    const statusInfo = getStatusInfo(order.status)
                    const StatusIcon = statusInfo.icon
                    return (
                      <div className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 ${statusInfo.color}`}>
                        <StatusIcon className="h-6 w-6" />
                        <div>
                          <span className="text-xl font-bold">{statusInfo.text}</span>
                          <p className="text-lg mt-1">{statusInfo.description}</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">{t('orderTracking.orderItems')}</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-lg font-medium text-gray-900">
                        {item.product_name}
                      </span>
                      <span className="text-lg text-gray-600 ml-4">
                        {t('checkout.quantity')}：{item.quantity}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.subtotal, order.currency)}
                    </span>
                  </div>
                ))}
              </div>
              
              {order.shipping_address && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-xl font-bold mb-3 text-gray-900">{t('orderTracking.shippingAddress')}</h4>
                  <p className="text-lg text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {order.shipping_address}
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking