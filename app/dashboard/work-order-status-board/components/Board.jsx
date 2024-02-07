'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import Task from './Task.jsx'


async function getTechAndWO(supabase, obj) {
    const {error: woError, data: work_order} = await supabase.from('work_order').select('id, product_number, created_at, type, number').eq('id', obj.work_order_id).single()
    const {error: techError, data: technician} = await supabase.from('technician').select('id, name').eq('id', obj.technician_id).single()

    return {work_order, technician}
}

async function getActiveWorkOrder(supabase, setFunction) {
    const {error, data} = await supabase.from('work_order_task').select('id, task_type, started_at, ended_at, is_completed, total_time, work_order (id, product_number, created_at, type, number), technician (id, name)').eq('is_completed', false)
    console.log('this is ran again')
    setFunction(data)
}

function realtime(supabase, setFunction) {
    const channels = supabase.channel('tasks')
    .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'work_order_task' },
    (payload) => {
        // console.log(payload)
        if(payload.eventType == 'INSERT') {
            setFunction((prev) => {
                return [...prev, payload.new]
            })
        }

        if(payload.eventType == 'UPDATE') {

            setFunction((prev) => {
                console.log('UPDATE', prev)
                let filtered = prev.filter((task) => task.id != payload.old.id)
                return filtered
            })
        }
    }
    )
    .subscribe()

    return channels
}

export default function Board() {
    const supabase = createClientComponentClient()
    const [tasks, setTasks] = useState([])
    
    useEffect(() => {
        realtime(supabase, setTasks)
        getActiveWorkOrder(supabase, setTasks)
    }, [])
    
    if(tasks.length == 0) {
        return (
            <div className="bg-white max-w-7xl shadow rounded mx-auto flex flex-col lg:flex-row gap-4 p-4">
                <p>No active jobs</p>
            </div> 
        )
    }
    return (
        <div className="bg-white max-w-7xl shadow rounded mx-auto flex flex-col lg:flex-row gap-4 p-4">
            {tasks.map((task) => (
                <Task task={task} key={task.id}/>
            ))}
        </div>
    )
}