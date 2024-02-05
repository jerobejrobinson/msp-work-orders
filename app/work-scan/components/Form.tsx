'use client'
import { useRef, useState } from "react"
import { submitForm } from "../actions/submitForm"
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image"
function LoadingAnimation() {
    return (
        <div role="status">
            <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin light:text-gray-100 fill-white p-12" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
}
export default function Form() {
    const [block, setBlock] = useState<boolean>(true)
    const ref = useRef<HTMLFormElement>(null)
    const badgeRef = useRef<HTMLInputElement>(null)
    const woRef = useRef<HTMLInputElement>(null)
    const taskRef = useRef<HTMLSelectElement>(null)
    const submitRef = useRef<HTMLButtonElement>(null)

    async function handleFormSubmit(formData: FormData) {
        const res = await submitForm(formData)
        ref.current?.reset()
        
        if(res?.error) {
            toast.error(res.error)
        }
        if(res?.status) {
            toast.success(res.status)
        }
        setBlock(true)
        badgeRef.current?.focus()
    }


    return (
        <form ref={ref} action={handleFormSubmit} className=" w-96 mx-auto space-y-4 p-4 bg-white border rounded shadow">
            <Toaster />
            <Image src="/images/clear-logo.png" width={200} height={100} alt="MSP Diesel Solution Logo" className="mx-auto"/>
            <div>
                <label htmlFor="" className="font-bold">Scan Badge</label>
                <input type="text" name="badge" className="border p-2 block w-full" required ref={badgeRef} autoFocus onChange={(e: any) => {
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
                <select name="task" id="task" className="border p-2 block w-full" required ref={taskRef} onChange={(e: any) => { submitRef.current?.focus() }}>
                    <option value="first-test">First Test</option>
                    <option value="teardown">Teardown</option>
                    <option value="cleaning">Clean</option>
                    <option value="part-and-inspection">Part & Inspection</option>
                    <option value="build">Build</option>
                    <option value="second-test">Second Test</option>
                </select>
            </div>
            {block ? (<button className={`bg-[#e8523d] w-full h-16 font-bold text-white`} ref={submitRef} onClick={() => setBlock(false)}>Submit Entry</button>) : (<button className={`bg-[#e8523d] w-full h-16 font-bold text-white flex flex-row justify-center items-center`} disabled><LoadingAnimation /></button>)}
        </form>
    )
}