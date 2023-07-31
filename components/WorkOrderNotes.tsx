import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
interface Note {
    id: string,
    created_at: Date,
    note: string,
    customer: { first_name: string } | null,
    admin: { first_name: string } | null
}
export default async function WorkOrderNotes({ wo }: { wo: any }) {
    const supabase = createServerComponentClient({ cookies })
    const { data: notes }= await supabase.from('note').select(`id, created_at, note, customer ( first_name ), admin ( first_name )`).eq('wo_id', wo.id).returns<[Note]>()
    return (
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
                    <div className=" italic font-light text-3xl p-4 flex flex-row pl-8 items-center">
                        No Notes Are Available
                    </div>
                )}
            </div>
        </div>
    )
}