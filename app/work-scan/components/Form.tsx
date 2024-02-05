'use client'
import { ChangeEventHandler, useRef, useState } from "react"
import { submitForm } from "../actions/submitForm"
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image"
export default function Form() {
    const [block, setBlock] = useState<boolean>(false)
    const ref = useRef<HTMLFormElement>(null)
    const woRef = useRef<HTMLInputElement>(null)
    const taskRef = useRef<HTMLSelectElement>(null)
    const submitRef = useRef<HTMLButtonElement>(null)

    async function handleFormSubmit(formData: FormData) {
        setBlock(true)
        const res = await submitForm(formData)
        ref.current?.reset()
        
        if(res?.error) {
            toast.error(res.error)
        }
        if(res?.status) {
            toast.success(res.status)
        }
        setBlock(false)
    }


    return (
        <form ref={ref} action={handleFormSubmit} className=" w-96 mx-auto space-y-4 p-4 bg-white border rounded shadow">
            <Toaster />
            <Image src="/images/clear-logo.png" width={200} height={100} alt="MSP Diesel Solution Logo" className="mx-auto"/>
            <div>
                <label htmlFor="" className="font-bold">Scan Badge</label>
                <input type="text" name="badge" className="border p-2 block w-full" required autoFocus onChange={(e: any) => {
                    if(e.target.value.length == 4) {
                        woRef.current?.focus()
                    }
                }}/>
            </div>
            <div>
                <label htmlFor="" className="font-bold">Scan Ticket</label>
                <input type="text" name="number" className="border p-2 block w-full" required ref={woRef} onChange={(e: any) => {
                    if(e.target.value.length == 5) {
                        taskRef.current?.focus()
                    }
                }}/>
            </div>
            <div>
                <label htmlFor="" className="font-bold">Select Task</label>
                <select name="task" id="task" className="border p-2 block w-full" required ref={taskRef} onChange={(e: any) => {
                    submitRef.current?.focus()
                }}>
                    <option value="first-test">First Test</option>
                    <option value="teardown">Teardown</option>
                    <option value="cleaning">Clean</option>
                    <option value="part-and-inspection">Part & Inspection</option>
                    <option value="build">Build</option>
                    <option value="second-test">Second Test</option>
                </select>
            </div>
            <button className={`${block ? 'hidden' : 'block'} bg-[#e8523d] w-full h-16 font-bold text-white`} ref={submitRef}>Submit Entry</button>
        </form>
    )
}