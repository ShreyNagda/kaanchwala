'use client'

import { useState } from 'react'
import { createDiscount } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { Plus, X, Loader2 } from 'lucide-react'

export function DiscountActions() {
 const [showForm, setShowForm] = useState(false)
 const [loading, setLoading] = useState(false)
 const [form, setForm] = useState({
 code: '',
 type: 'percentage' as 'percentage' | 'fixed',
 value: '',
 min_order_amount: '',
 valid_to: '',
 usage_limit: '',
 })

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)

 const result = await createDiscount({
 code: form.code,
 type: form.type,
 value: parseFloat(form.value),
 min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : 0,
 valid_from: new Date().toISOString(),
 valid_to: new Date(form.valid_to).toISOString(),
 usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
 })

 if (result.error) toast.error(result.error)
 else {
 toast.success('Discount created!')
 setShowForm(false)
 setForm({ code: '', type: 'percentage', value: '', min_order_amount: '', valid_to: '', usage_limit: '' })
 }
 setLoading(false)
 }

 return (
 <>
 <button onClick={() => setShowForm(true)} className="btn-primary gap-1.5 text-sm">
 <Plus className="h-4 w-4" /> Add Discount
 </button>

 {showForm && (
 <>
 <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
 <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md card p-6 animate-slide-up">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-semibold">Create Discount</h2>
 <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
 <X className="h-5 w-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 <input
 value={form.code}
 onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
 className="input-field font-mono"
 placeholder="DISCOUNT CODE"
 required
 />

 <div className="grid grid-cols-2 gap-3">
 <select
 value={form.type}
 onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
 className="input-field"
 >
 <option value="percentage">Percentage (%)</option>
 <option value="fixed">Fixed (₹)</option>
 </select>
 <input
 type="number"
 value={form.value}
 onChange={(e) => setForm({ ...form, value: e.target.value })}
 className="input-field"
 placeholder={form.type === 'percentage' ? '10' : '500'}
 required
 />
 </div>

 <input
 type="number"
 value={form.min_order_amount}
 onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
 className="input-field"
 placeholder="Min order amount (₹, optional)"
 />

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="text-xs text-muted-foreground block mb-1">Valid Until</label>
 <input
 type="date"
 value={form.valid_to}
 onChange={(e) => setForm({ ...form, valid_to: e.target.value })}
 className="input-field"
 required
 />
 </div>
 <div>
 <label className="text-xs text-muted-foreground block mb-1">Usage Limit</label>
 <input
 type="number"
 value={form.usage_limit}
 onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
 className="input-field"
 placeholder="Unlimited"
 />
 </div>
 </div>

 <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
 Create Discount
 </button>
 </form>
 </div>
 </>
 )}
 </>
 )
}
