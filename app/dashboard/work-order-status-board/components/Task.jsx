'use client'
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function formatTime(seconds) {
    let totalHours = Math.floor(seconds/(60*60))
    seconds = seconds - (totalHours*60*60)
    
    let totalMinutes = Math.floor(seconds/60)
    seconds = seconds - (totalMinutes*60)

    const formatDigits = (digits) => {
        return digits >= 10 ? digits : `0${digits}`
    }
    return `${formatDigits(totalHours)}:${formatDigits(totalMinutes)}:${formatDigits(seconds)}`
}

async function getTechAndWO(supabase, obj) {
    const {error: woError, data: work_order} = await supabase.from('work_order').select('id, product_number, created_at, type, number').eq('id', obj.work_order_id).single()
    const {error: techError, data: technician} = await supabase.from('technician').select('id, name').eq('id', obj.technician_id).single()

    obj.work_order = work_order
    obj.technician = technician
}

export default function Task({task}) {
    const supabase = createClientComponentClient()

    dayjs.extend(relativeTime)
    const startTime = dayjs(task.started_at).format('MM/DD/YYYY h:mm:ss A')
    const [time, setTime] = useState(formatTime(dayjs().diff(dayjs(task.started_at), 'second')));

    useEffect(() => {
        if(task.work_order_id) {
            (async () => {
                await getTechAndWO(supabase, task)
            })()
            console.log('this has to run ')
        }
    }, [])

    useEffect(() => {
        let intervalId;
        intervalId = setInterval(() => setTime(() => {

            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            return formatTime(dayjs().diff(dayjs(task.started_at), 'seconds'))
        }), 1000);
        
        return () => clearInterval(intervalId);
      }, [time]);

    if(task.work_order === undefined) {
        return (
            <div>
                loading
            </div>
        )
    }
    return (
        <Link href={`/dashboard/${task.work_order.id}`}>
            <div className="grid grid-cols-3 bg-white border rounded shadow">
                <div className="col-span-2 p-2">
                    <p className="font-bold">Technician</p>
                    <p>{task.technician.name}</p>
                </div>
                <div className=" p-2">
                    <p className="font-bold">WO-Number</p>
                    <p>{task.work_order.number}</p>
                </div>
                <div className="col-span-2 p-2">
                    <p className="font-bold">Work Order Part Number</p>
                    <p>{task.work_order.product_number}</p>
                </div>
                <div className=" p-2">
                    <p className="font-bold">Task Type</p>
                    <p>{task.task_type}</p>
                </div>
                <div className="bg-[#fde4c6] col-span-full p-2">
                    <p className="font-bold">Task Start Time</p>
                    <p>{startTime}</p>
                    <p className="font-bold">Time Spent On Task</p>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}