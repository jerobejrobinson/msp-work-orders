'use client'
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from 'react'
import { usePathname, useRouter } from "next/navigation"
import {  } from "next/navigation"

export default function CustomerActions() {
    const supabase = createClientComponentClient()

    const wo_id = usePathname()?.split('/')[2]
    const router = useRouter()
    const [clicked, setClicked ] = useState<boolean>(false)
    const [note, setNote] = useState<string | null>(null)

    const handleNoteClick = () => {
        setClicked(prev => !prev)
    }
    
    const submitNote = async () => {
        // get customer id from work order
        const { data: wo, error: woError } = await supabase.from('work_order').select('customer_id, id').eq('id', wo_id).limit(1).single()
        
        if(woError) return woError

        // insert note to table with woid and customer id as foreign keys
        const { error: noteError } = await supabase.from('note').insert({wo_id, customer_id: wo.customer_id, note})

        if(noteError) return noteError

        // handleNoteClick()
        router.refresh()

    }
    return (
        <div className="w-full max-w-7xl py-8">
            <div className="w-full flex justify-between">
                <Link
                    href="/work-orders"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    back
                </Link>
                {!clicked ? (
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                        onClick={handleNoteClick}
                    >
                        Add Note
                    </button>
                ):
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-btn-background flex flex-row items-center bg-greenLight text-white"
                        onClick={submitNote}
                    >
                        Submit Note
                    </button>
                }
            </div>
            {clicked && (
                <div className="w-full p-4">
                    <textarea 
                    name="note" 
                    id="note" 
                    className="w-full border rounded p-4 outline-0" 
                    rows={7}
                    onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>
            )}
        </div>
    )
}