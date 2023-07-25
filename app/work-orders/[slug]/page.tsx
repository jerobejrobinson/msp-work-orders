import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CustomerActions from "./Actions"
import Link from "next/link"
import WorkOrder from "@/components/WorkOrderComponent"

interface Note {
    id: string,
    created_at: Date,
    note: string,
    customer: { first_name: string } | null,
    admin: { first_name: string } | null
}

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

    const { data: notes }= await supabase.from('note').select(`id, created_at, note, customer ( first_name ), admin ( first_name )`).eq('wo_id', params.slug).returns<[Note]>()
    const { data: test_results }= await supabase.from('test_result').select(`id, created_at, note, link, admin ( first_name )`).eq('wo_id', params.slug).returns<[TestResult]>()
    
    const { data: billing, error } = await supabase.from('billing').select('id, created_at, notes, amount, link, approved, approved_at, invoice, admin ( first_name )').eq('wo_id', params.slug).limit(1).returns<[Billing]>().single()


    const recieved = () => {
        // shipping label has not been submitted
        if(!wo.return_shipping) {
            return ''
            // shipping label has been submitted
        } else if(wo.number === 'pending') {
            return 'bg-greenLight text-white animate-pulse'
            // work order number has been submitted
        } else {
            return 'bg-greenLight text-white'
        }
    }

    const tested = () => {
        //work order number has been submitted
        if(test_results?.length) {
            return 'bg-greenLight text-white'
        }
        if(wo.number !== 'pending' && !test_results?.length) {
            return 'bg-greenLight text-white animate-pulse'
        } else {
            return ''
        }
    }

    const billed = () => {
        //work order number has been submitted
        if(billing) {
            return 'bg-greenLight text-white'
        }
        if(!billing && test_results?.length) {
            return 'bg-greenLight text-white animate-pulse'
        } else {
            return ''
        }
    }

    const workInProgress = () => {
        if(!billing) return ''
        if(billing.approved) {
            return 'bg-greenLight text-white'
        }else {
            return 'bg-greenLight text-white animate-pulse'
        }
    }



    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center relative mt-16">
            <CustomerActions wo={wo} customer_id={customerData.id} billing={billing}/>
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Status</p>
                {wo.type !== 'test only' ? (
                    <div className="grid grid-cols-6 bg-white rounded border">
                        <div className="p-4 flex justify-center bg-[#90EE90] text-white">Submitted</div>
                        <div className={`p-4 border-l-2 flex justify-center ${recieved()}`}>Received</div>
                        <div className={`p-4 border-l-2 flex justify-center ${tested()}`}>tested</div>
                        <div className={`p-4 border-l-2 flex justify-center ${billed()}`}>Billed</div>
                        <div className={`p-4 border-l-2 flex justify-center ${workInProgress()}`}>Work In Progress</div>
                        <div className="p-4 border-l-2 flex justify-center">Shipped</div>
                    </div>
                    ): <div className="grid grid-cols-5 bg-white rounded">
                        <div  className="p-4 flex justify-center bg-[#90EE90] text-white">Submitted</div>
                        <div className={`p-4 border-l-2 flex justify-center ${recieved()}`}>Recieved</div>
                        <div className={`p-4 border-l-2 flex justify-center ${tested()}`}>Tested</div>
                        <div className={`p-4 border-l-2 flex justify-center ${billed()}`}>Billed</div>
                        <div className="p-4 border-l-2 flex justify-center">Shipped</div>
                    </div> 
                }
            </div>
            {/* Work Order Details  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Details <span className="font-light text-md"> Last Updated - {new Date(wo.last_update_at).toString()}</span></p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    <div className="flex flex-col">
                        <p className="font-bold">Work Order Number</p>
                        <p>{wo.number}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Product Number</div>
                        <p>{wo.product_number}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Quanity</div>
                        <p>{wo.quanity}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Submission Date</div>
                        <p>{new Date(wo.created_at).toString()}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Work Order Type</div>
                        <p>{wo.type}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Carrier</div>
                        <p>{wo.carrier}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Shipping</div>
                        <p>{wo.shipping}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Shipping Label</div>
                        {wo.return_shipping && <Link href={wo.return_shipping}>Download Label</Link>}
                    </div>
                </div>
            </div>
            {/* Part Issues  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Part Issues</p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    {wo.part_issues.map((issue: string, index: string) => (
                        <div key={index}>
                            {issue}
                        </div>
                    ))}
                    <div className="col-span-4">
                        <div className="font-bold">Details</div>
                        <p>{wo.details}</p>
                    </div>
                </div>
            </div>
            {/* Notes  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Notes</p>
                <div className="bg-white border rounded">
                    {notes && notes.length > 0 && notes.map((note, index) => {
                        if(note.admin) {
                            return (
                                <div className={`${index % 2 === 0 ? 'bg-gray-200' : ''} p-4`} key={index}>
                                    <div className="p-2"><span className="font-bold">Admin</span>: {note.admin?.first_name}</div>
                                    <div className="col-span-2 p-2">{note.note}</div>
                                    <div className=" italic">{new Date(note.created_at).toString()}</div>
                                </div>
                            )
                        }
                        if(note.customer) {
                            return (
                                <div className={`${index % 2 === 0 ? 'bg-gray-200' : ''} p-4`} key={index}>
                                    <div className="font-bold p-2">{note.customer?.first_name}</div>
                                    <div className="col-span-2 p-2">{note.note}</div>
                                    <div className=" italic">{new Date(note.created_at).toString()}</div>
                                </div>
                            )
                        }
                    })}
                    {!notes?.length  && (
                        <div className=" italic font-light text-3xl p-4 flex flex-row justify-center items-center">
                            No Notes Are Available
                        </div>
                    )}
                </div>
            </div>
            {/* Test Results  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Test Results</p>
                <div className="bg-white border rounded">
                    {test_results && test_results.length > 0 && test_results.map((test, index) => {
                        return (
                            <div className={`${index % 2 === 0 ? 'bg-gray-200' : ''} p-4`} key={index}>
                                <Link className="col-span-2 p-2 font-bold" href={test.link}>View PDF</Link>
                                <div className="col-span-2 p-2">{test.note}</div>
                                <div className="italic">{new Date(test.created_at).toString()}</div>
                                <div className="p-2"><span className="font-bold">Uploaded By</span> - {test.admin?.first_name}</div>
                            </div>
                        )
                    })}
                    {!test_results?.length  && (
                        <div className=" italic font-light text-3xl p-4 flex flex-row justify-center items-center">
                            No Test Results Available Yet
                        </div>
                    )}
                </div>
            </div>
            {/* Billing Status */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Billing Status</p>
                <div className="bg-white border rounded">
                    {!billing  && (
                        <div className=" italic font-light text-3xl p-4 flex flex-row justify-center items-center">
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
        </div>
    )
}