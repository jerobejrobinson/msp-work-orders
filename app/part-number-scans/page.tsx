'use client'
import { toast, Toaster } from "react-hot-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRef, useState } from "react"

export default async function Page() {
    const supabase = await createClientComponentClient()

    // const inputRef = useRef<HTMLInputElement>(null)

    async function handleAutoSubmit(str: string, pn: string) {
        const {error} = await supabase.from('work_orders').insert({serial_number: str, pn: pn})

        console.log(error)
        if(error) {
            toast.error(error?.message)
        }

        
        toast.success('Serial number submitted')
        
    }
    
    return (
        <section className="flex flex-col justify-center items-center h-screen">
            <Toaster />
            <form className="flex flex-col border-2 p-4">
                <label htmlFor="">Scan Barcode</label>
                <input
                    // ref={inputRef}
                    type="text"
                    className="border w-96" 
                    autoFocus 
                    onChange={(e) => {
                        if(e.target.value.length == 26) {
                            let partNumber = e.target.value.slice(0,11)
                            let serialNumber = e.target.value.slice(16,21)
                            handleAutoSubmit(serialNumber, partNumber)
                            e.target.value = ''
                            e.target.focus()
                        }
                    }}
                />
            </form>
        </section>
    )
}