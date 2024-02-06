'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useRef } from 'react'
import { useRouter } from "next/navigation"
import { toast, Toaster } from "react-hot-toast"

export default function Form() {
    const supabase = createClientComponentClient()
    const inputRef = useRef(null)

    async function handleAutoSubmit(str, pn) {
        const {error, data} = await supabase.from('temp_serial_number').insert({serial_number: str, part_number: pn}).select()

        console.log(error)
        if(error) {
            toast.error(error.message)
        }
        if(data) {
            toast.success('Serial number submitted')
        }
        inputRef.current.value = ''
        inputRef.current.focus()
    }

    return (
        <form className="flex flex-col p-4">
            <Toaster />
            <label htmlFor="">Scan Barcode</label>
            <input
                ref={inputRef}
                type="text"
                className="border w-96 font-sans" 
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
            <p className="text-sm font-sans text-red-400">* needs PDF417 scanner to work</p>
        </form>
    )
}