import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import AdminActions from "./Actions"
import BillingAction from "./BillingAction"
import ProgressBar from "@/components/ProgressBar"
import WorkOrder from "@/components/WorkOrderComponent"
import WorkOrderNotes from "@/components/WorkOrderNotes"
import TestResults from "@/components/TestResults"
import Images from "@/components/Images"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
export const dynamic = 'force-dynamic'

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

interface Note {
    id: string,
    created_at: Date,
    note: string,
    customer: { first_name: string } | null,
    admin: { first_name: string } | null
}


interface Image {
    id: string,
    wo_id: string,
    created_at: Date,
    url: string,
    type: string
}

interface Task {
    id: number, 
    started_at: Date, 
    ended_at: Date, 
    total_time: string, 
    is_completed: boolean, 
    task_type: string, 
    technician: {
        name: string
    }
}
export const revalidate = 0

export default async function Order({params}: { params: { slug: string }}) {
    dayjs.extend(relativeTime)
    const supabase = createServerComponentClient({ cookies })
    const { data: { user }} = await supabase.auth.getUser()
    const { data: admin  } = await supabase.from('admin').select('user_id, id').eq('user_id', user?.id).limit(1).single()
    const { data: wo } = await supabase.from('work_order').select().eq('id', params.slug).limit(1).single()

    if(!wo) {
        notFound()
    }

    const { data: test_results, error: test_resultsError }= await supabase.from('test_result').select(`id, created_at, note, link, admin ( first_name )`).eq('wo_id', wo.id).returns<[TestResult]>()
    const { data: billing, error: billingError } = await supabase.from('billing').select('id, created_at, notes, amount, link, approved, approved_at, invoice, admin ( first_name )').eq('wo_id', wo.id).limit(1).returns<[Billing]>().single()
    const { data: notes }= await supabase.from('note').select(`id, created_at, note, customer ( first_name ), admin ( first_name )`).eq('wo_id', wo.id).returns<[Note]>()
    const { data: images, error: imagesError } = await supabase.from('image').select('*').eq('wo_id', wo.id).returns<[Image]>()
    const { data: tasks, error: taskError } = await supabase.from('work_order_task').select(`id, started_at, ended_at, total_time, is_completed, task_type, technician(name)`).eq('work_order_id', wo.id).returns<[Task] | []>()
    const { data: customer, error: customerError } = await supabase.from('customer').select('*').eq('id', wo.customer_id).limit(1).single()

    console.log(tasks)
    return (
        <div className="w-full bg-background flex flex-col items-center relative mt-16">
            <AdminActions wo={wo} testRes={test_results} billing={billing} admin={admin} notes={notes}  images={images}/>
            <ProgressBar wo={wo} test_results={test_results} billing={billing} />
            <WorkOrder wo={wo} />
            {/* Customer Information  */}
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
            {/* End Customer Information */}
            {/* Start Work Order Tasks*/}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold">Tasks</p>
                <div className="grid grid-cols-3 gap-4 p-8 bg-white border rounded">
                    {tasks?.length == 0 && (
                        <div className=" italic font-light text-3xl flex flex-row items-center">
                            No Tasks Available
                        </div>
                    )}
                    {tasks?.map((task) => (
                        <div className={`rounded shadow font-sans ${task.is_completed ? "border" : "border-[#e8523d] border-2" }`}>
                            <div className="grid grid-cols-2 items-center">
                                <p className="font-bold  p-2 bg-[#fde4c6]">Task</p>
                                <p className=" p-2 bg-white">{task.task_type}</p>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <p className="font-bold p-2 bg-[#fde4c6]">Time Started</p>
                                <p className="p-2 bg-white">{dayjs(task.started_at).format('MM/DD/YYYY h:mm:ss A')}</p>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <p className="font-bold p-2 bg-[#fde4c6]">Technician</p>
                                <p className="p-2 bg-white">{task.technician.name}</p>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <p className="font-bold p-2 bg-[#fde4c6]">Total Time</p>
                                <p className="p-2 bg-white animate-pulse">{task.total_time ? task.total_time : 'On Going'}</p>
                            </div>
                            {/* <p>is completed? {tas}</p> */}
                        </div>
                    ))}
                    
                </div>
            </div>
            {/* End Work Order Tasks*/}
            <WorkOrderNotes notes={notes} />

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
            
            <Images images={images} />
        </div>
    )
}