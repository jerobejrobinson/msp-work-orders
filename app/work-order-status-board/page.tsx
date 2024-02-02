import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import Board from "./components/Board"

// export const revalidate = 0;

export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    const { data: admin  } = await supabase.from('admin').select('user_id, first_name').eq('user_id', user?.id).limit(1).single()
    
    // If not admin redirect user to home
    if(!admin) {
        redirect('/')
    }

    const {error, data} = await supabase.from('work_order_task').select('id, task_type, started_at, ended_at, is_completed, total_time, work_order (id, product_number, created_at, type, number), technician (id, name)').eq('is_completed', false)

    if(data) {
        return (
            <main className="flex flex-col justify-center items-center h-screen bg-gray-200">
                <Board initialTasks={data}/>
            </main>
        )
    } else {
        return (
            <div>
                Loading
            </div>
        )
    }
}