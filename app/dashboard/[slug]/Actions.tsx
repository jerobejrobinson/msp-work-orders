'use client'
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from "next/navigation"
import {  } from "next/navigation"

interface Admin {
    id: string | null
}

export default function AdminActions() {
    const supabase = createClientComponentClient()
    const wo_id = usePathname()?.split('/')[2]
    const router = useRouter()
    const adminId = async () => {
        // get user id
        const { data: { user } } = await supabase.auth.getUser()

        if(!user) return 'not authenicated'

        // get admin id
        const { data } = await supabase.from('admin').select('user_id, id').eq("user_id", user.id).limit(1).single()

        if(data?.id) {
            return data.id
        } else {
            return null
        }
    }

    const [noteClicked, setNoteClicked ] = useState<boolean>(false)
    const [note, setNote] = useState<string | null>(null)
    const handleNoteClick = () => {
        setNoteClicked(prev => !prev)
    }
    const submitNote = async () => {
        const data = await adminId()

        if(!data) return 'not allowed'

        // insert note to table with woid and admin id as foreign keys
        const { error: noteError } = await supabase.from('note').insert({wo_id, admin_id: data, note})

        if(noteError) return noteError

        handleNoteClick()
        router.refresh()
    }
    
    const [numberClicked, setNumberClicked ] = useState<boolean>(false)
    const [number, setNumber] = useState<string | null>(null)
    const handleNumberClick = () => {
        setNumberClicked(prev => !prev)
    }
    const updateWorkOrderNumber = async () => {
        const data = await adminId()

        if(!data) return 'not allowed'

        const { error } = await supabase.from('work_order').update({number: number}).eq('id', wo_id)

        if(error) return error

        router.refresh()
    }
    


    return (
        <div className="w-full max-w-7xl py-8">
            <div className="w-full flex justify-between">
                <Link
                    href="/dashboard"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    back
                </Link>
                <div className="flex flex-row gap-4">
                {!noteClicked ? (
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                        onClick={handleNoteClick}
                    >
                        Add Note
                    </button>
                ):
                    (
                        <>
                            <button
                                className="py-2 px-4 rounded-md no-underline bg-main flex flex-row items-center text-white"
                                onClick={handleNoteClick}
                            >
                                Cancel Note
                            </button>
                            <button
                                className="py-2 px-4 rounded-md no-underline bg-btn-background flex flex-row items-center bg-greenLight text-white"
                                onClick={submitNote}
                            >
                                Submit Note
                            </button>
                        </>
                    )
                }
                {!numberClicked ? (
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                        onClick={handleNumberClick}
                    >
                        Add Work Order Number
                    </button>
                    ):(
                    <>
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-main hover:bg-btn-background-hover flex flex-row items-center"
                        onClick={handleNumberClick}
                    >
                        Cancel Action
                    </button>
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-btn-background flex flex-row items-center bg-greenLight text-white"
                        onClick={updateWorkOrderNumber}
                    >
                        Submit Work Order Number
                    </button>
                    </>
                    )
                }
                </div>
            </div>
            {noteClicked && (
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
            {numberClicked && (
                <div className="w-full p-4">
                    <input type="text" name="number" id="number" onChange={(e) => setNumber(e.target.value)} className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white w-full"/>
                </div>
            )}
        </div>
    )
}