'use server'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { UUID } from "crypto"
import { cookies } from "next/headers"

interface Technician {
    id: number
}
interface WorkOrder {
    id: string
}
export async function submitForm(formData: FormData) {
    const supabase = await createServerComponentClient({cookies})
    // const { error, data: { user } } = await supabase.auth.getUser()
    // const { data: admin  } = await supabase.from('admin').select('user_id, first_name').eq('user_id', user?.id).limit(1).single()
    
    // if(error) return error;

    const rawFormData = {
        badge: formData.get('badge'),
        number: formData.get('number'),
        task: formData.get('task'),
    }

    const { error: technicianError, data: technician } = await supabase.from('technician').select('id').eq('number', Number(rawFormData.badge)).single<Technician>()
    
    switch(technicianError?.code) {
        case 'PGRST116':
            console.log('Technician not found')
            break;
            
            default:
            return {error: `Unknown error code. Send error code ${technicianError?.code} to developer for debugging.`}
    }

    const { error: taskError, data: workOrder } = await supabase.from('work_order').select('id').eq('number', rawFormData.number).single<WorkOrder>()
    switch(taskError?.code) {
        case 'PGRST116':
            console.log('Work Order not found')
            break;
            
            default:
            return {error: `Unknown error code. Send error code ${taskError?.code} to developer for debugging.`}
    }
        
    const { error: insertError } = await supabase.from('work_order_task').insert({technician_id: technician?.id, work_order_id: workOrder?.id, task_type: rawFormData.task})
    // console.log(rawFormData)
}