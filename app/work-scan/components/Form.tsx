'use client'
import { useRef } from "react"
import { submitForm } from "../actions/submitForm"
export default function Form() {
    const ref = useRef<HTMLFormElement>(null)

    async function handleFormSubmit(formData: FormData) {
        await submitForm(formData)
        ref.current?.reset()
    }
    
    return (
        <form ref={ref} action={handleFormSubmit}>
            <div>
                    <label htmlFor="">Scan Badge</label>
                    <input type="text" name="badge" className="border p-2 block"/>
                </div>
                <div>
                    <label htmlFor="">Scan Ticket</label>
                    <input type="text" name="number" className="border p-2 block"/>
                </div>
                <div>
                    <label htmlFor="">Select Task</label>
                    <select name="task" id="task" className="border p-2 block">
                        <option value="first-test">First Test</option>
                        <option value="teardown">Teardown</option>
                        <option value="cleaning">Clean</option>
                        <option value="part-and-inspection">Part & Inspection</option>
                        <option value="build">Build</option>
                        <option value="second-test">Second Test</option>
                    </select>
                </div>
                <button className="bg-[#e8523d] w-full">Submit Task</button>
        </form>
    )
}