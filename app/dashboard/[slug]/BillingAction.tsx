'use client'

import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
export default function BillingAction({billing}: { billing: any }) {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const handleDeleteBilling = async () => {
        if(!billing) return ''
        const { error } = await supabase.from('billing').delete().eq('id', billing.id)
        if(error) return console.error(error.message)
        router.refresh()
    }

    return (
        <div className="p-4 relative">
            {!billing.approved && (
                <button className="text-main" onClick={handleDeleteBilling}>Click to delete and upload a new quote</button>
            )}
            <p className="font-bold">Invoice Number</p>
            <p>{billing.invoice}</p>
            <p className="font-bold">Amount</p>
            <p>${billing.amount}</p>
            <p className="font-bold">Link</p>
            <Link href={billing.link}>View PDF</Link>
            {billing.notes && (<>
                <p className="font-bold">Note</p>
                <p>{billing.notes}</p>
            </>)}
            {billing.approved_at && (
                <>
                    <p className="font-bold">Approval Status</p>
                    <p>{billing.approved ? 'Approved' : 'Declined'}</p>
                    <p className="font-bold">Decision Made At</p>
                    <p>{new Date(billing.approved_at).toString()}</p>
                </>
            )}
        </div>
    )
}