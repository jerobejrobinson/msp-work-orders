'use server'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

interface Technician {
    id: number
    number: number
    name: string
    is_active: boolean
}
interface WorkOrder {
    id: string
    number: string
}

interface CheckTask {
    id: number
    started_at: any
    task_type: string
    is_completed: boolean
    work_order: WorkOrder
    technician: Technician
}

interface FormSubmit {
    error: string | null
    status: string | null
}

function supabaseErrorCodes(error: any, stem: string) {
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
        default:
            return `Error code unknown: ${error.code}, see developer for debugging. Entry point: ${stem}`
    }
}

export async function submitForm(formData: FormData): Promise<FormSubmit | undefined> {
    const supabase = await createServerComponentClient({cookies})
    dayjs.extend(relativeTime)

    const rawFormData = {
        badge: formData.get('badge'),
        number: formData.get('number'),
        task: formData.get('task'),
    }

    // Get Technician Badge ID
    const { error: technicianError, data: technician } = await supabase.from('technician').select('id, number, name, is_active').eq('number', Number(rawFormData.badge)).single<Technician>()
    if(technicianError) {
        return {error: supabaseErrorCodes(technicianError, 'Technician Error'), status: null}
    }
    if(!technician.is_active) {
        return {error: 'disabled user', status: null}
    }
    // Get Work Order ID
    const { error: workOrderError, data: workOrder } = await supabase.from('work_order').select('id, number').eq('number', rawFormData.number).single<WorkOrder>()
    if(workOrderError) {
        return {error: supabaseErrorCodes(workOrderError, 'Work Order Error'), status: null}
    }

    // Try to get task from given inputs
    const { error: checkTaskError, data } = await supabase.from('work_order_task').select('id, started_at, task_type, is_completed, work_order ( id, number ), technician ( id, name )').eq('work_order_id', workOrder?.id).eq('is_completed', false).single<CheckTask>()

    if(checkTaskError) {
        if(checkTaskError.code = 'PGRST116') {
            const { error: insertTaskError } = await supabase.from('work_order_task').insert({task_type: rawFormData.task, technician_id: technician?.id, work_order_id: workOrder?.id})
            if(insertTaskError) {
                return {error: supabaseErrorCodes(insertTaskError, 'Insert Task Error'), status: null}
            }
            return {error: null, status: 'Task started'}
        } else {
            return {error: supabaseErrorCodes(checkTaskError, 'Check Task Error'), status: null}
        }
    }

    if(data) {
        if(data.technician?.id == technician?.id) {
            if(data.task_type != rawFormData.task) {
                return {error: `Must select task: ${data.task_type}, to complete`, status: null}
            }
            // Update task to completed and return
            const ended_at = ((new Date()).toISOString()).toLocaleString()
            const totalTime = dayjs(data.started_at).from(ended_at, true)
            const { error: updateTaskError } = await supabase.from('work_order_task').update({is_completed: true, ended_at: ended_at, total_time: totalTime}).eq('id', data.id)

            if(updateTaskError) {
                return {error: supabaseErrorCodes(updateTaskError, 'Update Task Error'), status: null}
            }
            return {error: null, status: 'Task has been set to completed'};
        } else {
            return {error: 'The scanned ticket can not be checked out because it is currently being worked on.', status: null};
        }
    } 
}