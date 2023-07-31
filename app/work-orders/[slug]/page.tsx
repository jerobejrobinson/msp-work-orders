import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CustomerActions from "./Actions"
import Link from "next/link"
import ProgressBar from "@/components/ProgressBar"
import WorkOrder from "@/components/WorkOrderComponent"
import WorkOrderNotes from "@/components/WorkOrderNotes"
import TestResults from "@/components/TestResults"
import Images from "@/components/Images"

interface TestResult {
    id: string,
    created_at: Date,
    note: string,
    admin: { first_name: string } | null,
    link: string
}
interface Billing {
    id: string,
    created_at: Date,
    notes: string,
    admin: { first_name: string } | null,
    link: string,
    amount: number,
    approved: true | false,
    approved_at: Date,
    invoice: string
}

export default async function Order({params}: { params: { slug: string }}) {

    const supabase = createServerComponentClient({ cookies })

    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
        redirect('/login')
    }

    const { data: customerData } = await supabase.from('customer').select('user_id, id').eq('user_id', user.id).limit(1).single()

    if(!customerData) {
        redirect('/profile')
    }

    const { data: wo } = await supabase.from('work_order').select().eq('id', params.slug).limit(1).single()
    const { data: test_results }= await supabase.from('test_result').select(`id, created_at, note, link, admin ( first_name )`).eq('wo_id', params.slug).returns<[TestResult]>()
    const { data: billing, error } = await supabase.from('billing').select('id, created_at, notes, amount, link, approved, approved_at, invoice, admin ( first_name )').eq('wo_id', params.slug).limit(1).returns<[Billing]>().single()

    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center relative mt-16">
            <CustomerActions wo={wo} customer_id={customerData.id} billing={billing} testing={test_results}/>

            {/* @ts-expect-error Server Component */}
            <ProgressBar wo={wo} billing={billing} test_results={test_results}/>

            {/* @ts-expect-error Server Component */}
            <WorkOrder wo={wo} />
            
            {/* @ts-expect-error Server Component */}
            <WorkOrderNotes wo={wo} />

            {/* @ts-expect-error Server Component */}
            <TestResults test_results={test_results} />

            {/* Billing Status */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Billing Status</p>
                <div className="bg-white border rounded">
                    {!billing  && (
                        <div className=" italic font-light text-3xl p-4 flex flex-row pl-8 items-center">
                            Billing not available yet
                        </div>
                    )}
                    {billing && (
                        <div className="p-4 relative">
                            <p className="font-bold">Invoice Number</p>
                            <p>{billing.invoice}</p>
                            <p className="font-bold">Amount</p>
                            <p>${billing.amount}</p>
                            <p className="font-bold">Link</p>
                            <Link href={billing.link}>View PDF</Link>
                            <p className="font-bold">Note</p>
                            <p>{billing.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* @ts-expect-error Server Component */}
            <Images wo={wo} />
        </div>
    )
}