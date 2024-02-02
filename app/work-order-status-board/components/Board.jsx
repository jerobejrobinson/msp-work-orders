'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import Task from './Task.jsx'
import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
export default function Board({ initialTasks }) {
    const supabase = createClientComponentClient()
    // const router = useRouter()
    const [tasks, setTasks] = useState(initialTasks)
    
    // useEffect(() => {
    //     const channel = supabase
    //         .channel('tasks')
    //         .on('postgres_changes',
    //             {
    //                 event: '*',
    //                 schema: 'public',
    //                 table: 'work_order_task'
    //             },
    //             (payload) => {
    //                 location.reload()
    //             }
    //         )
    //         .subscribe()
        
    //     return () => {
    //         supabase.removeChannel('tasks')
    //     }
    // }, [supabase])
    
    // console.log(tasks)
    
    return (
        <div className="bg-white max-w-7xl shadow rounded mx-auto flex flex-row gap-4 p-4">
            {tasks.map((task) => (
                <Task task={task} key={task.id}/>
            ))}
        </div>
    )
}