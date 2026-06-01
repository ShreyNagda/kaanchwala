'use client'

import { approvePrescription, rejectPrescription } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'

export function PrescriptionActions({ prescriptionId }: { prescriptionId: string }) {
 const [loading, setLoading] = useState(false)

 const handleApprove = async () => {
 setLoading(true)
 const result = await approvePrescription(prescriptionId)
 if (result.error) toast.error(result.error)
 else toast.success('Prescription approved')
 setLoading(false)
 }

 const handleReject = async () => {
 const notes = prompt('Reason for rejection (optional):') || undefined
 setLoading(true)
 const result = await rejectPrescription(prescriptionId, notes)
 if (result.error) toast.error(result.error)
 else toast.success('Prescription rejected')
 setLoading(false)
 }

 return (
 <div className="flex items-center gap-2">
 <button onClick={handleApprove} disabled={loading} className="btn-primary gap-1.5 text-xs py-1.5 px-3">
 {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
 Approve
 </button>
 <button onClick={handleReject} disabled={loading} className="btn-ghost gap-1.5 text-xs py-1.5 px-3 text-destructive border-destructive/30 hover:bg-destructive/5">
 <X className="h-3 w-3" />
 Reject
 </button>
 </div>
 )
}
