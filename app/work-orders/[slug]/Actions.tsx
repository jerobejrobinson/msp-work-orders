'use client'
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from 'react'
import { usePathname, useRouter } from "next/navigation"
import {  } from "next/navigation"

export default function CustomerActions({wo, customer_id, billing}: {wo: any, customer_id: string, billing: any}) {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const [clicked, setClicked ] = useState<boolean>(false)
    const [note, setNote] = useState<string | null>(null)
    const handleNoteClick = () => {
        setClicked(prev => !prev)
    }
    const submitNote = async () => {
        // insert note to table with woid and customer id as foreign keys
        const { error: noteError } = await supabase.from('note').insert({wo_id: wo.id, customer_id, note})

        if(noteError) return noteError

        // handleNoteClick()
        router.refresh()
    }

    const [ billingClick, setBillingClick ] = useState<boolean>(false)
    const [ approvalChoice, setApprovalChoice ] = useState<boolean>(false)
    const handleBillingClick = () => {
        setBillingClick(prev => !prev)
    }
    const submitApproval = async () => {
        const { error } = await supabase.from('billing').update({approved: approvalChoice, approved_at: new Date().toISOString()}).eq('id', billing.id)
        if(error) return console.error(error.message)

        handleBillingClick()
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
                <div className="flex flex-row gap-4">
                {!clicked ? (
                    <BtnAction click={handleNoteClick} name="Note" />
                ):
                    <BtnOptions click={handleNoteClick} submit={submitNote} name="Note" />
                }
                {!billing ? '' :
                    billing.approval !== null ? '' : 
                    wo.type !== 'test only' && !billingClick ? (
                        <BtnAction click={handleBillingClick} name="Approve Billing" />
                    ): (
                        <BtnOptions click={handleBillingClick} submit={submitApproval} name="Billing"/>
                    )
                }
                </div>
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
            {billingClick && (
                <div className="w-full p-4 bg-white rounded mt-4 space-y-4">
                    <Link href={billing.link} className="font-bold">Click To View Bill</Link>
                    <p>Amount: {billing.amount}</p>
                    <div>
                        <label htmlFor="billingTrue">Approve: </label>
                        <input 
                            type="radio" 
                            name="billing" 
                            id="billingTrue" 
                            value="true" 
                            className="w-4 h-4 mr-4" 
                            onChange={(e) => {
                                setApprovalChoice(e.target.value === 'true')
                            }}
                        />
                        <label htmlFor="billingFalse">Decline: </label>
                        <input 
                            type="radio" 
                            name="billing" 
                            id="billingFalse" 
                            value="false"
                            className="w-4 h-4"  
                            onChange={(e) => {
                                setApprovalChoice(e.target.value === 'true')
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function BtnOptions({click, submit, name}: {click: any, submit: any, name: string}) {
    return (
        <>
            <button
                className="py-2 px-4 rounded-md no-underline bg-main hover:bg-btn-background-hover flex flex-row items-center"
                onClick={click}
            >
                Cancel Action
            </button>
            <button
                className="py-2 px-4 rounded-md no-underline bg-btn-background flex flex-row items-center bg-greenLight text-white"
                onClick={submit}
            >
                Submit {name}
            </button>
        </>
    )
}

function BtnAction({click, name}: {click: any, name: string}) {
    return (
        <button
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
            onClick={click}
        >
            Add {name}
        </button>
    )
}