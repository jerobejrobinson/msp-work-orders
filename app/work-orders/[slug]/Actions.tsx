'use client'
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { Toaster, toast } from "react-hot-toast"

export default function CustomerActions({wo, customer_id, billing, testing}: {wo: any, customer_id: string, billing: any, testing: any}) {
    const supabase = createClientComponentClient()
    const router = useRouter()
    
    const [clicked, setClicked ] = useState<boolean>(false)
    const [note, setNote] = useState<string | null>(null)
    const handleNoteClick = () => {
        setClicked(prev => !prev)
    }
    const submitNote = async () => {
        if(!note) {
            return toast.error(<p>Cannot submit empty value.</p>)
        }

        toast.loading('Submitting new note.....')
        const { data, error: noteError } = await supabase.from('note').insert({wo_id: wo.id, customer_id, note}).select()
        if(noteError) {
            toast.dismiss()
            toast.error(noteError.message)
            return;
        }
        if(data) { 
            toast.dismiss()
            await fetch(`/work-orders/get/api/email/send-note?id=${wo.id}&nId=${data[0].id}`)
            await fetch(`/work-orders/c/api/log`, {
                method: 'POST',
                body: JSON.stringify({
                    id: wo.id,
                    cId: customer_id,
                    type: `Added new note.`
                })
            })
            toast.success('Added note')
        }
        handleNoteClick()
        router.refresh()
    }

    const [typeClick, setTypeClick] = useState<boolean>(false)
    const [type, setType] = useState<string | null>(null)
    const handleTypeClick = () => {
        setTypeClick(prev => !prev)
    }
    const updateType= async () => {
        if(!type) {
            return toast.error(<p>Must select either <b>reman</b> or <b>repair</b></p>)
        }

        toast.loading('Updating work order type.....')
        const { data, error } = await supabase.from('work_order').update({type}).eq('id', wo.id).select()
        if(error) {
            toast.dismiss()
            toast.error(error.message)
            return;
        }
        if(data) {
            toast.dismiss()
            await fetch(`/work-orders/get/api/email/send-type-decision?id=${wo.id}`)
            await fetch(`/work-orders/c/api/log`, {
                method: 'POST',
                body: JSON.stringify({
                    id: wo.id,
                    cId: customer_id,
                    type: `Updated work order type.`
                })
            })
            toast.success('Updated type')
        }
        handleTypeClick()
        router.refresh()
    }

    const [ billingClick, setBillingClick ] = useState<boolean>(false)
    const [ approvalChoice, setApprovalChoice ] = useState<boolean>(false)
    const handleBillingClick = () => {
        setBillingClick(prev => !prev)
    }
    const submitApproval = async () => {
        if(!approvalChoice) {
            return toast.error(<p>Must select either <b>decline</b> or <b>approve</b></p>)
        }

        toast.loading('loading')
        const { data, error } = await supabase.from('billing').update({approved: approvalChoice, approved_at: new Date().toISOString()}).eq('id', billing.id).select()
        if(error) {
            toast.dismiss() 
            toast.error(error.message)
            return;
        }
        if(data) {
            toast.dismiss()
            await fetch(`/work-orders/get/api/email/send-wo-approval?id=${wo.id}&bId=${billing.id}`)
            await fetch(`/work-orders/c/api/log`, {
                method: 'POST',
                body: JSON.stringify({
                    id: wo.id,
                    cId: customer_id,
                    type: `Submitted work order approval.`
                })
            })
            toast.success('decision sent')
        }
        handleBillingClick()
        router.refresh()
    }
    return (
        <div className="w-full max-w-7xl py-8">
            <Toaster/>
            <div className="w-full flex justify-between">
                <Link
                    href="/work-orders"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    back
                </Link>
                <div className="flex flex-row gap-4">
                {!clicked ? (
                    <BtnAction click={handleNoteClick} name="Add Note" />
                ):
                    <BtnOptions click={handleNoteClick} submit={submitNote} name="Note" />
                }
                {wo.type !== "test and r&r"  ?  " " : 
                    !testing?.length ? " " :
                    !typeClick ? (
                        <BtnAction click={handleTypeClick} name="Change Order Type" />
                    ) : (
                        <BtnOptions click={handleTypeClick} submit={updateType} name="Order Type"/>
                    ) 
                }
                {   
                    wo.type == 'test only' ? "" : 
                    !billing ? '' :
                    billing.approved !== null ? '' : 
                    !billingClick ? (
                        <BtnAction click={handleBillingClick} name="Approve Billing" />
                    ): (
                        <BtnOptions click={handleBillingClick} submit={submitApproval} name="Billing"/>
                    )
                }
                </div>
            </div>
            <div className="py-4 space-y-4">
            {clicked && (
                <div className="w-full p-4 bg-white rounded border shadow">
                    <p className="text-lg font-bold col-span-4">Add Note To Work Order</p>
                    <textarea 
                    name="note" 
                    id="note" 
                    className="w-full border rounded p-4 outline-0" 
                    rows={7}
                    onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>
            )}
            {typeClick && (
                <div className="w-full p-4 bg-white rounded border shadow">
                    <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Work Order Type</p>
                    <div className='flex flex-row items-center'>
                        <input 
                            type="radio" 
                            name="type" 
                            id="repair" 
                            value="repair" 
                            className="mr-4 w-6 h-6"
                            onChange={(e) => setType(e.target.value)}
                        />
                        <label htmlFor="repair" className='cursor-pointer'>Repair</label>
                    </div>
                    <div className='flex flex-row items-center'>
                        <input 
                            type="radio" 
                            name="type" 
                            id="reman" 
                            value="reman" 
                            className="mr-4 w-6 h-6"
                            onChange={(e) => setType(e.target.value)}
                        />
                        <label htmlFor="reman" className='cursor-pointer'>Reman</label>
                    </div>
                </div>
                </div>
            )}
            {billingClick && (
                <div className="w-full p-4 bg-white rounded mt-4 space-y-4 border shadow">
                    <Link href={billing.link} rel="noopener noreferrer" target="_blank" className="font-bold" >Click To View Bill</Link>
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
            {name}
        </button>
    )
}