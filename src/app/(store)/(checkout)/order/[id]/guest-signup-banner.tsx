'use client'

import { useState } from 'react'
import { convertGuestToAccount } from '@/lib/actions/auth'
import { Sparkles, Gift, Loader2 } from 'lucide-react'

interface GuestSignupBannerProps {
 email: string
}

export function GuestSignupBanner({ email }: GuestSignupBannerProps) {
 const [showForm, setShowForm] = useState(false)
 const [loading, setLoading] = useState(false)
 const [success, setSuccess] = useState(false)
 const [formData, setFormData] = useState({
 email,
 full_name: '',
 phone: '',
 password: '',
 })

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)

 const fd = new FormData()
 Object.entries(formData).forEach(([k, v]) => fd.append(k, v))

 const result = await convertGuestToAccount(null, fd)
 if (result?.success) {
 setSuccess(true)
 }
 setLoading(false)
 }

 if (success) {
 return (
 <div className="card p-6 mb-6 border-accent/30 bg-accent/5">
 <div className="flex items-center gap-3">
 <Gift className="h-6 w-6 text-accent" />
 <div>
 <h3 className="font-semibold text-foreground">Account Created! 🎉</h3>
 <p className="text-sm text-muted-foreground mt-1">
 Use code <span className="font-bold text-accent">WELCOME5</span> for 5% off your next order.
 </p>
 </div>
 </div>
 </div>
 )
 }

 return (
 <div className="card p-6 mb-6 border-accent/30 bg-accent/5">
 <div className="flex items-start gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 flex-shrink-0">
 <Sparkles className="h-5 w-5 text-accent" />
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-foreground">
 Get 5% off your next order!
 </h3>
 <p className="text-sm text-muted-foreground mt-1">
 Create an account to track orders, save prescriptions, and unlock a <strong>5% discount</strong> on your next purchase.
 </p>

 {!showForm ? (
 <button
 onClick={() => setShowForm(true)}
 className="btn-accent mt-4 gap-2"
 >
 <Gift className="h-4 w-4" />
 Create Account & Get 5% Off
 </button>
 ) : (
 <form onSubmit={handleSubmit} className="mt-4 space-y-3">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <input
 type="text"
 value={formData.full_name}
 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
 className="input-field"
 placeholder="Full Name"
 required
 />
 <input
 type="tel"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 className="input-field"
 placeholder="Phone (10 digits)"
 required
 />
 </div>
 <input
 type="email"
 value={formData.email}
 className="input-field bg-muted"
 disabled
 />
 <input
 type="password"
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="input-field"
 placeholder="Create a password (min 6 chars)"
 required
 minLength={6}
 />
 <button type="submit" disabled={loading} className="btn-accent w-full gap-2">
 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
 {loading ? 'Creating...' : 'Create Account & Get 5% Off'}
 </button>
 </form>
 )}
 </div>
 </div>
 </div>
 )
}
