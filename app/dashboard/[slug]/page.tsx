import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminActions from "./Actions"
import BillingAction from "./BillingAction"
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

    const { data: admin  } = await supabase.from('admin').select('user_id, id').eq('user_id', user?.id).limit(1).single()

    if(!admin) {
        redirect('/')
    }

    const { data: wo } = await supabase.from('work_order').select().eq('id', params.slug).limit(1).single()

    const { data: test_results, error: test_resultsError }= await supabase.from('test_result').select(`id, created_at, note, link, admin ( first_name )`).eq('wo_id', wo.id).returns<[TestResult]>()
    const { data: billing, error: billingError } = await supabase.from('billing').select('id, created_at, notes, amount, link, approved, approved_at, invoice, admin ( first_name )').eq('wo_id', wo.id).limit(1).returns<[Billing]>().single()

    const { data: customer, error: customerError } = await supabase.from('customer').select('*').eq('id', wo.customer_id).limit(1).single()
              
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center relative mt-16">
            <AdminActions wo={wo} testRes={test_results} billing={billing} admin={admin}/>

            {/* @ts-expect-error Server Component */}
            <ProgressBar wo={wo} test_results={test_results} billing={billing} />
            
            {/* @ts-expect-error Server Component */}
            <WorkOrder wo={wo} />
            
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold">Customer Information</p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    <div className="flex flex-col">
                        <p className="font-bold">Name</p>
                        <p>{customer.first_name} {customer.last_name}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Phone</p>
                        <p>{customer.phone}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Company</p>
                        <p>{customer.company_name}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Account Number</p>
                        <p>{customer.account_number}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">Address</p>
                        <p>{customer.address} {customer.address_2 && (", " + customer.address_2)} </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">City</p>
                        <p>{customer.city}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold">State</p>
                        <p>{customer.state}</p>
                    </div>
                </div>
            </div>

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
                        <BillingAction billing={billing} />
                    )}
                </div>
            </div>
            
            {/* @ts-expect-error Server Component */}
            <Images wo={wo} />
        </div>
    )
}