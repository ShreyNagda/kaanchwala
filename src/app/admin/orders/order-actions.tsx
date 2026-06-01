'use client'

import { updateOrderStatus, addTrackingInfo, initiateRefund } from '@/lib/actions/admin'
import type { Order, OrderStatus } from '@/lib/types'
import { toast } from 'sonner'
import { useState } from 'react'
import { ChevronRight, Truck, RotateCcw, Loader2 } from 'lucide-react'

const STATUS_FLOW: OrderStatus[] = ['pending', 'verified', 'processing', 'shipped', 'delivered']

export function OrderActions({ order }: { order: Order }) {
 const [showTracking, setShowTracking] = useState(false)
 const [trackingNumber, setTrackingNumber] = useState('')
 const [courier, setCourier] = useState('')
 const [loading, setLoading] = useState(false)

 const currentIndex = STATUS_FLOW.indexOf(order.status as OrderStatus)
 const nextStatus = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
 ? STATUS_FLOW[currentIndex + 1]
 : null

 const handleAdvanceStatus = async () => {
 if (!nextStatus) return

 // If advancing to 'shipped', show tracking form
 if (nextStatus === 'shipped') {
 setShowTracking(true)
 return
 }

 setLoading(true)
 const result = await updateOrderStatus(order.id, nextStatus)
 if (result.error) toast.error(result.error)
 else toast.success(`Status updated to ${nextStatus}`)
 setLoading(false)
 }

 const handleAddTracking = async () => {
 if (!trackingNumber || !courier) {
 toast.error('Enter tracking number and courier')
 return
 }
 setLoading(true)
 const result = await addTrackingInfo(order.id, trackingNumber, courier)
 if (result.error) toast.error(result.error)
 else {
 toast.success('Order shipped with tracking info')
 setShowTracking(false)
 }
 setLoading(false)
 }

 const handleRefund = async () => {
 if (!confirm('Are you sure you want to refund this order?')) return
 setLoading(true)
 const result = await initiateRefund(order.id)
 if (result.error) toast.error(result.error)
 else toast.success('Refund initiated')
 setLoading(false)
 }

 if (order.status === 'cancelled') return <span className="text-xs text-muted-foreground">Cancelled</span>
 if (order.status === 'delivered') {
 return (
 <button onClick={handleRefund} disabled={loading} className="text-xs text-destructive hover:underline flex items-center gap-1">
 {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
 Refund
 </button>
 )
 }

 return (
 <div className="space-y-2">
 {!showTracking ? (
 <button
 onClick={handleAdvanceStatus}
 disabled={loading || !nextStatus}
 className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
 >
 {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ChevronRight className="h-3 w-3" />}
 → {nextStatus}
 </button>
 ) : (
 <div className="flex flex-col gap-2 min-w-48">
 <input
 value={trackingNumber}
 onChange={(e) => setTrackingNumber(e.target.value)}
 className="input-field text-xs py-1.5"
 placeholder="Tracking number"
 />
 <input
 value={courier}
 onChange={(e) => setCourier(e.target.value)}
 className="input-field text-xs py-1.5"
 placeholder="Courier (e.g. Delhivery)"
 />
 <button onClick={handleAddTracking} disabled={loading} className="btn-primary text-xs py-1.5">
 {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Truck className="h-3 w-3" />}
 Ship
 </button>
 </div>
 )}
 </div>
 )
}
