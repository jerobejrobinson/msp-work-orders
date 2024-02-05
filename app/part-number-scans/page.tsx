'use client'
import { toast, Toaster } from "react-hot-toast"

export default async function Page() {
    
    function handleAutoSubmit() {
        
    }
    
    return (
        <section className="flex flex-col justify-center items-center h-screen">
            <Toaster />
            <form className="flex flex-col border-2 p-4">
                <label htmlFor="">Scan Barcode</label>
                <input type="text" name="" id="" className="border w-96" autoFocus />
            </form>
        </section>
    )
}