'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Form() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    
    const [formState, setFormState] = useState<{
        product_number: String | null,
        quanity: Number | null,
        part_issues: Array<string>,
        details: String | null,
        shipping: String | null,
        carrier: String | null,
        type: 'reman' | 'test only' | 'repair' | null
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
        const { data: { user } } = await supabase.auth.getUser()

        if(!user) return 'not a user'

        const { data: customer } = await supabase.from('customer').select('user_id, id').eq('user_id', user.id).limit(1).single()
 
        if(!customer) return null

        const { data: workOrderData, error } = await supabase.from('work_order').insert([{...formState, customer_id: customer.id}]).select()

        console.log(error)
        if(workOrderData) {
            router.push('/work-orders')
            router.refresh()
        }
    }
    return (
        <div className='w-full bg-background flex flex-col items-center'>
            <h1 className="text-xl font-bold text-center p-4">Create New Work Order</h1>
            <form className="flex flex-col gap-4 bg-white p-4 rounded border w-full max-w-4xl" onSubmit={handleWorkOrderSubmission}>
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
                    <label  className="col-span-3" htmlFor="fedex">Fedex</label>
                    <input 
                        type="radio" 
                        name="carrier" 
                        id="ups" 
                        value="ups"
                        onChange={handleInputState}
                    />
                    <label  className="col-span-3" htmlFor="ups">UPS</label>
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
                    <label  className="col-span-3" htmlFor="standard">Standard Ground (No Charge)</label>
                    <input 
                        type="radio" 
                        name="shipping" 
                        id="next-day" 
                        value="next day"
                        onChange={handleInputState}
                    />
                    <label  className="col-span-3" htmlFor="next-day">Expedited Next Day ($50 Upcharge)</label>
                </div>
                <div className="grid grid-cols-3 gap-y-2">
                    <p className="text-lg font-bold col-span-3">Select Work Order Type</p>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            id="test-only" 
                            value="test only" 
                            className=" mr-4"
                            onChange={handleInputState}
                        />
                        <label htmlFor="test-only">Test Only</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            id="repair" 
                            value="repair" 
                            className="mr-4"
                            onChange={handleInputState}
                        />
                        <label htmlFor="repair">Repair</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            id="reman" 
                            value="reman" 
                            className="mr-4"
                            onChange={handleInputState}
                        />
                        <label htmlFor="reman">Reman</label>
                    </div>
                </div>
                <button type="submit" className="bg-main w-full p-4 text-white text-lg font-bold">
                    Submit Work Order
                </button>
            </form>
        </div>
    )
}