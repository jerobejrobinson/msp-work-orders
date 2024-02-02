import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import Form from "./components/Form"
export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    const { data: admin  } = await supabase.from('admin').select('user_id, first_name').eq('user_id', user?.id).limit(1).single()
    
    // If not admin redirect user to home
    if(!admin) {
        redirect('/')
    }

    return (
        <main className="flex flex-col justify-center h-screen bg-gray-200">
            <Form />
        </main>
    )
}