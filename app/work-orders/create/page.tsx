'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, redirect } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast';

interface WorkOrder {
    product_number: string | null,
    quanity: number | null,
    part_issues: Array<string>,
    details: string | null,
    shipping: 'standard' | 'next day' | null,
    carrier: 'ups' | 'fedex' | null,
    type: 'reman' | 'test only' | 'repair' | 'test and r&r' | null,
    id: string,
    created_at: Date,
    last_update_at: Date,
    return_shipping: string | null,
    completed_at: Date | null,
    customer_id: number
}

export default function Form() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [submitState, setSubmitState] = useState<boolean>(false)
    const [formState, setFormState] = useState<{
        product_number: String | null,
        quanity: Number | null,
        part_issues: Array<string>,
        details: String | null,
        shipping: String | null,
        carrier: String | null,
        type: 'reman' | 'test only' | 'repair' | 'test and r&r' | null
    }>({
        product_number: null,
        quanity: null,
        part_issues: [],
        details: null,
        shipping: null,
        carrier: null,
        type: null
    })

    const handleInputState = (e: React.ChangeEvent<HTMLInputElement>, isNumber: Boolean = false) => {
        setFormState(prev => {
            return {
                ...prev,
                [e.target.name]: isNumber ? Number(e.target.value ) : e.target.value 
            }
        })
    }
    const handleTextAreaState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormState(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value 
            }
        })
    }
    const handleCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => {
            if(prev.part_issues.includes(e.target.value)) {
                const filterIssues = prev.part_issues.filter(val => val !== e.target.value)
                return {
                    ...prev,
                    part_issues: [...filterIssues]
                }
            }
            return {
                ...prev,
                part_issues: [...prev.part_issues, e.target.value]
            }
        })
    }

    const handleWorkOrderSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        toast.loading("Pending Submission")
        const { data: { user } } = await supabase.auth.getUser()

        if(!user) return 'not a user'

        const { data: customer } = await supabase.from('customer').select('user_id, id, email, first_name, last_name').eq('user_id', user.id).limit(1).single()
 
        if(!customer) return redirect('/profile')

        const { data: workOrderData, error } = await supabase.from('work_order').insert([{...formState, customer_id: customer.id}]).select().limit(1).single<WorkOrder>()

        if(error) return toast.error(error.message)

        // const res = 
        if(workOrderData) {
            await fetch(`/work-orders/create/api/email?id=${workOrderData.id}`)
            toast.dismiss()
            toast.success('Work Order Submitted!')
            router.push(`/work-orders/create/successful?id=${workOrderData.id}`)
            router.refresh()
        }
    }
    return (
        <div className='w-full bg-background flex flex-col items-center py-8 mt-16'>
            <Toaster />
            <h1 className="text-xl font-bold text-center p-4">Create New Work Order</h1>
            <form className="flex flex-col gap-4 bg-white p-4 rounded border w-full max-w-4xl shadow" onSubmit={handleWorkOrderSubmission}>
                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="part-number" className="text-lg font-bold">Part Number: </label>
                    <input 
                        required 
                        type="text" 
                        id="part-number" 
                        name="product_number" 
                        placeholder="enter part number" 
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white"
                        onChange={handleInputState}
                    />
                    <label htmlFor="quanity" className="text-lg font-bold">Quanity: </label>
                    <input 
                        required 
                        type="text" 
                        id="quanity" 
                        name="quanity" 
                        placeholder="enter quanity" 
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white"
                        onChange={(e) => handleInputState(e, true)}
                    />
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Part Issue</p>
                    <input 
                        type="checkbox" 
                        id="over-fuelingCheckbox" 
                        name="over-fueling" 
                        value="over-fueling"
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="over-fuelingCheckbox">Over-fueling</label>
                    
                    <input 
                        type="checkbox" 
                        id="under-fuelingCheckbox" 
                        name="under-fueling" 
                        value="under-fueling" 
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="under-fuelingCheckbox">Under-fueling</label>

                    <input 
                        type="checkbox" 
                        id="smokingCheckbox" 
                        name="smoking" 
                        value="smoking" 
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="smokingCheckbox">Smoking</label>

                    <input 
                        type="checkbox" 
                        id="timingCheckbox" 
                        name="timing" 
                        value="timing" 
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="timingCheckbox">Timing Issues</label>

                    <input 
                        type="checkbox" 
                        id="leakingCheckbox" 
                        name="leaking" 
                        value="leaking" 
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="leakingCheckbox">Leaking</label>

                    <input 
                        type="checkbox" 
                        id="startingCheckbox" 
                        name="starting" 
                        value="starting" 
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="startingCheckbox">Starting</label>

                    <input 
                        type="checkbox" 
                        id="runningCheckbox" 
                        name="running" 
                        value="running" 
                        onChange={handleCheckboxState}
                    />
                    <label className="col-span-3" htmlFor="runningCheckbox">Running rough</label>

                    <input  
                        type="checkbox" 
                        id="otherCheckbox"
                        name="other" 
                        value="other" 
                        onChange={handleCheckboxState}
                     />
                    <label className="col-span-3" htmlFor="otherCheckbox">Other</label>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="extraDetails" className="text-lg font-bold">Additional Details</label>
                    <textarea 
                        required 
                        name="details" 
                        id="extraDetaisl" 
                        cols={30} 
                        rows={10} 
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white" 
                        onChange={handleTextAreaState}
                    ></textarea>
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Carrier</p>
                    <input 
                        type="radio" 
                        name="carrier" 
                        id="fedex" 
                        value="fedex"
                        onChange={handleInputState}
                    />
                    <label  className="col-span-3 cursor-pointer" htmlFor="fedex">Fedex</label>
                    <input 
                        type="radio" 
                        name="carrier" 
                        id="ups" 
                        value="ups"
                        onChange={handleInputState}
                    />
                    <label  className="col-span-3 cursor-pointer" htmlFor="ups">UPS</label>
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Shipping</p>
                    <input 
                        type="radio" 
                        name="shipping" 
                        id="standard" 
                        value="standard"
                        onChange={handleInputState}
                    />
                    <label  className="col-span-3 cursor-pointer" htmlFor="standard">Standard Ground (No Charge)</label>
                    <input 
                        type="radio" 
                        name="shipping" 
                        id="next-day" 
                        value="next day"
                        onChange={handleInputState}
                    />
                    <label  className="col-span-3 cursor-pointer" htmlFor="next-day">Expedited Next Day ($50 Upcharge)</label>
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Work Order Type</p>
                    <div className='flex flex-row items-center'>
                        <input 
                            type="radio" 
                            name="type" 
                            id="test-only" 
                            value="test only" 
                            className="mr-4 w-6 h-6"
                            onChange={handleInputState}
                        />
                        <label htmlFor="test-only" className='cursor-pointer'>Test Only</label>
                    </div>
                    <div className='flex flex-row items-center'>
                        <input 
                            type="radio" 
                            name="type" 
                            id="test-rr" 
                            value="test and r&r" 
                            className="mr-4 w-6 h-6"
                            onChange={handleInputState}
                        />
                        <label htmlFor="test-rr" className='cursor-pointer'>Test And R&R</label>
                    </div>
                    <div className='flex flex-row items-center'>
                        <input 
                            type="radio" 
                            name="type" 
                            id="repair" 
                            value="repair" 
                            className="mr-4 w-6 h-6"
                            onChange={handleInputState}
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
                            onChange={handleInputState}
                        />
                        <label htmlFor="reman" className='cursor-pointer'>Reman</label>
                    </div>
                </div>
                <button type="submit" className={`bg-main rounded w-full p-4 text-white text-lg font-bold ${submitState ? 'animate-pulse' : ''}`} onClick={() => setSubmitState(prev => !prev)} disabled={submitState}>
                    {submitState ? "Submitting..." : "Submit Work Order"}
                </button>
            </form>
        </div>
    )
}