import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Package, FileText, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
 const db = createAdminClient()

 // Fetch stats
 const { count: totalOrders } = await db.from('orders').select('*', { count: 'exact', head: true })
 const { count: pendingOrders } = await db.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
 const { count: pendingPrescriptions } = await db.from('prescriptions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
 const { count: lowStockVariants } = await db.from('variants').select('*', { count: 'exact', head: true }).lte('stock_quantity', 5).gt('stock_quantity', 0)
 const { count: outOfStock } = await db.from('variants').select('*', { count: 'exact', head: true }).eq('stock_quantity', 0)

 // Recent orders
 const { data: recentOrders } = await db
 .from('orders')
 .select('id, customer_email, total, status, created_at')
 .order('created_at', { ascending: false })
 .limit(5)

 // Revenue (rough calc from all verified+ orders)
 const { data: revenueData } = await db
 .from('orders')
 .select('total')
 .in('status', ['verified', 'processing', 'shipped', 'delivered'])

 const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

 const statCards = [
 { label: 'Total Orders', value: totalOrders || 0, icon: <ShoppingCart className="h-5 w-5" />, color: 'text-accent' },
 { label: 'Revenue', value: formatPrice(totalRevenue), icon: <DollarSign className="h-5 w-5" />, color: 'text-success' },
 { label: 'Pending Orders', value: pendingOrders || 0, icon: <TrendingUp className="h-5 w-5" />, color: 'text-accent' },
 { label: 'Pending Rx', value: pendingPrescriptions || 0, icon: <FileText className="h-5 w-5" />, color: 'text-accent' },
 { label: 'Low Stock', value: lowStockVariants || 0, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-destructive' },
 { label: 'Out of Stock', value: outOfStock || 0, icon: <Package className="h-5 w-5" />, color: 'text-destructive' },
 ]

 return (
 <div>
 <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

 {/* Stats Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
 {statCards.map((card) => (
 <div key={card.label} className="card p-5">
 <div className={`flex items-center gap-2 mb-2 ${card.color}`}>
 {card.icon}
 <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
 </div>
 <p className="text-2xl font-bold text-foreground">{card.value}</p>
 </div>
 ))}
 </div>

 {/* Recent Orders */}
 <div className="card p-6">
 <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
 {recentOrders && recentOrders.length > 0 ? (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-border">
 <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Order</th>
 <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Customer</th>
 <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Total</th>
 <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">Status</th>
 </tr>
 </thead>
 <tbody>
 {recentOrders.map((order) => (
 <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
 <td className="py-3 px-2 font-mono text-xs">{order.id.slice(0, 8)}</td>
 <td className="py-3 px-2">{order.customer_email}</td>
 <td className="py-3 px-2 font-medium">{formatPrice(order.total)}</td>
 <td className="py-3 px-2">
 <span className={`badge ${
 order.status === 'delivered' ? 'badge-success' :
 order.status === 'cancelled' ? 'badge-destructive' :
 'badge'
 }`}>
 {order.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ) : (
 <p className="text-muted-foreground text-sm">No orders yet</p>
 )}
 </div>
 </div>
 )
}
