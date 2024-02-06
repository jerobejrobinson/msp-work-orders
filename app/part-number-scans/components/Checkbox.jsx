'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "react-hot-toast"

export default function Checkbox({ row }) {
    const supabase = createClientComponentClient()
    const router = useRouter()

    async function handleClick(serial_number) {
        const {error, data} = await supabase.from('temp_serial_number').update({used: true}).eq('serial_number', serial_number).select()
        console.log(error)
        if(error) {
            toast.error(error.message)
        }
        if(data) {
            console.log(data)
            toast.success('Serial number used')
            router.refresh()
        }
    }

    return (
        <>
            <Toaster />
            <input type='checkbox' className={`${row.used ? '' : 'cursor-pointer'}`} checked={row.used} disabled={row.used} onChange={() => handleClick(row.serial_number)}/>
        </>
    )
}