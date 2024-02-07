'use client'
import { useState } from "react" 
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"



export default function Technician({ tech }) {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [modal, setModal] = useState(false)
    const [checkbox, setCheckbox] = useState(true)

    async function handleSubmit(value, tech) {
        console.log(value, tech)
        const {error, data} = await supabase.from('technician').update({is_active: value}).eq('id', tech.id)
        console.log(error)
        console.log(data)
        router.refresh()
    }
    return (
        <div className="border shadow rounded">
            <div className="flex flex-row justify-between p-4">
                <div>
                    <p className="font-bold">Name</p>
                    <p>{tech.name}</p>
                </div>
                <div>
                    <p className="font-bold">Section</p>
                    <p>{tech.type}</p>
                </div>
                <div>
                    <button className="font-light text-sm underline" onClick={() => {setModal(prev => !prev)}}>edit</button>
                </div>
            </div>
            <div className="bg-gray-200 p-4 flex flex-col justify-center items-center">
                <img src={`http://bwipjs-api.metafloor.com/?bcid=code128&text=${tech.number}&parsefnc&alttext=${tech.number}`} width={100} height={100} alt={`badge for ${tech.name}`}/>
            </div>
            {modal && (
                <>
                    {/* <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"> */}
                        <div className="bg-white border-2 border-black shadow rounded-md w-full max-w-sm fixed z-50 top-0 left-0 translate-x-[calc(50vw-50%)] translate-y-[calc(50vh-50%)]">
                            <div className="p-4">
                                <p className="font-bold">Name</p>
                                <p>{tech.name}</p>
                            </div>
                            <div className="p-4">
                                <p className="font-bold">Section</p>
                                <p>{tech.type}</p>
                            </div>
                            <form className="flex flex-row items-center gap-4 p-4 bg-gray-200">
                                <label className="block text-sm">Disable Technician Badge</label>
                                <input className="block w-4 h-4" type="checkbox" name="" id="" onChange={() => {setCheckbox(false)}}/>
                            </form>
                            <div className="p-4 bg-gray-200 flex flex-row items-end">
                                <button className="text-sm underline text-main" onClick={() => {setModal(false)}}>close</button>
                                <button className="p-4 bg-main text-white rounded ml-auto block" onClick={() => {
                                    handleSubmit(checkbox, tech)
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
        </div>
    )
}