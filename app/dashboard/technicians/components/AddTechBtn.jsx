'use client'
import { useState } from "react" 
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Toaster, toast } from 'react-hot-toast'

function supabaseErrorCodes(error, stem) {
    console.log(error)
    switch(error.code) {
        case 'PGRST116':
            return `No entry in database. Entry point: ${stem}`
        case 'PGRST204':
            return `COLUMN not found in TABLE. Entry point: ${stem}`
        case '23502':
            return `Data passed violates not-null constraint. Entry point: ${stem}`
        case '22P02':
            return `Invalid input type for UUID. Entry point: ${stem}`
        case '21000':
            return `UPDATE requires a where clause. Entry point: ${stem}`
        case '23505':
            return `Duplicate value submitted, check inputs. Entry point: ${stem}`
        default:
            return `Error code unknown: ${error.code}, see developer for debugging. Entry point: ${stem}`
    }
}

export default function AddTechBtn() {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const [modal, setModal] = useState(false)
    const [name, setName] = useState(null)
    const [badgeNumber, setBadgeNumber] = useState(null)
    const [section, setSection] = useState('PUMPS')

    async function handleSubmit(name, badgeNumber, section) {
        const { data, error } = await supabase
        .from('technician')
        .insert([
        { name: name, number: Number(badgeNumber), type: section },
        ])
        .select()

        if(error) {
            let msg = supabaseErrorCodes(error, 'Add New Tech')
            toast.error(msg)
            router.refresh()
            return;
        }

        toast.success('Tech Added')
        router.refresh()
        
    }

    return (
        <>
            <button className="bg-gray-300 p-4 rounded" onClick={() => setModal(true)}>Add New Tech</button>
            <Toaster />
            {modal && (
                <>
                    {/* <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"> */}
                        <div className="bg-white border-2 border-black shadow rounded-md w-full max-w-sm fixed z-50 top-0 left-0 translate-x-[calc(50vw-50%)] translate-y-[calc(50vh-50%)]">
                            <div className="p-4">
                                <p className="font-bold">Name</p>
                                <input type="text" onChange={(e) => setName(e.target.value)} className="border"/>
                            </div>
                            <div className="p-4">
                                <p className="font-bold">Badge Number <span className="text-sm font-light">| must be 4 digit number</span></p>
                                <input type="text" onChange={(e) => setBadgeNumber(e.target.value)} className="border" maxLength={4}/>
                            </div>
                            <div className="p-4">
                                <p className="font-bold">Section</p>
                                <select name="" id="" className="border" onChange={(e) => setSection(e.target.value)}>
                                    <option value="PUMPS">PUMPS</option>
                                    <option value="INJECTORS">INJECTORS</option>
                                </select>
                            </div>
                            <div className="p-4 bg-gray-200 flex flex-row items-end">
                                <button className="text-sm underline text-main" onClick={() => {setModal(false)}}>close</button>
                                <button className="p-4 bg-main text-white rounded ml-auto block" onClick={() => {
                                    handleSubmit(name, badgeNumber, section)
                                    setModal(false)
                                }}>Save Changes</button>
                            </div>
                        </div>
                    {/* </div> */}
                    <div className=" cursor-pointer opacity-25 fixed inset-0 z-40 bg-black" onClick={() => {
                        setModal(false)
                    }}>
                    </div>
                </>
            )}
        </>
    )
}