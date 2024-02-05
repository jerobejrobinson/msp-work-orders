'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import Task from './Task.jsx'

export const revalidate = 1000;

async function getActiveWorkOrder(setFunction, supabase) {
    const {error, data} = await supabase.from('work_order_task').select('id, task_type, started_at, ended_at, is_completed, total_time, work_order (id, product_number, created_at, type, number), technician (id, name)').eq('is_completed', false)

    setFunction(data)
}
export default function Board() {
    const supabase = createClientComponentClient()
    const [tasks, setTasks] = useState(null)
    useEffect(() => {
        getActiveWorkOrder(setTasks, supabase)
    }, [tasks])
    
    if(!tasks) {
        return (
            <div>Loading Active Work Orders</div>
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