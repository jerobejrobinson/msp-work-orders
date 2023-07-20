import NoteForm from "@/components/NewForm"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Order({params}: { params: { slug: string, cid: number }}) {

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

    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center">
            <div className="w-full max-w-7xl flex justify-between py-8">
                <Link
                    href="/work-orders"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center flex-wrap"
                >
                    back
                </Link>
                <Link
                    href={`/${wo.id}/notes`}
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    Add Note To Work Order
                </Link>
            </div>
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Work Order Details <span className="font-light text-md"> Last Updated - {new Date(wo.last_update_at).toString()}</span></p>
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
            
        </div>
    )
}