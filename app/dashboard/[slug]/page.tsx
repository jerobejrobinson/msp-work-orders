import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminActions from "./Actions"

interface Note {
    id: string,
    created_at: Date,
    note: string,
    customer: { first_name: string } | null,
    admin: { first_name: string } | null
}

export default async function Order({params}: { params: { slug: string }}) {

    const supabase = createServerComponentClient({ cookies })

    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
        redirect('/login')
    }

    const { data: admin  } = await supabase.from('admin').select('user_id').eq('user_id', user?.id).limit(1).single()

    if(!admin) {
        redirect('/')
    }

    const { data: wo } = await supabase.from('work_order').select().eq('id', params.slug).limit(1).single()

    const { data: notes }= await supabase.from('note').select(`id, created_at, note, customer ( first_name ), admin ( first_name )`).eq('wo_id', params.slug).returns<[Note]>()


    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center relative mt-16">
            <AdminActions />
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Status</p>
                {wo.type !== 'test only' ? (
                    <div className="grid grid-cols-6 bg-white rounded border">
                        <div className="p-4 flex justify-center bg-[#90EE90] text-white">Submitted</div>
                        <div className={`p-4 border-l-2 flex justify-center ${wo.number === 'pending' ? 'bg-[#90EE90] text-white animate-pulse' : 'bg-[#90EE90] text-white'}`}>{wo.number === 'pending' ? 'Awaiting Arrival' : 'Received'}</div>
                        <div className="p-4 border-l-2 flex justify-center">Tested</div>
                        <div className="p-4 border-l-2 flex justify-center">Billed</div>
                        <div className="p-4 border-l-2 flex justify-center">Work In Progress</div>
                        <div className="p-4 border-l-2 flex justify-center">Shipped</div>
                    </div>
                    ): <div className="grid grid-cols-5 bg-white rounded">
                        <div  className="p-4 flex justify-center bg-[#90EE90] text-white">Submitted</div>
                        <div className={`p-4 border-l-2 flex justify-center ${wo.number === 'pending' ? 'bg-[#90EE90] text-white animate-pulse' : 'bg-[#90EE90] text-white'}`}>{wo.number === 'pending' ? 'Awaiting Arrival' : 'Received'}</div>
                        <div className="p-4 border-l-2 flex justify-center">Tested</div>
                        <div className="p-4 border-l-2 flex justify-center">Billed</div>
                        <div className="p-4 border-l-2 flex justify-center">Shipped</div>
                    </div> 
                }
            </div>
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
                </div>
            </div>
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
        </div>
    )
}