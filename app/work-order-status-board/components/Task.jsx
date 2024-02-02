'use client'
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useState, useEffect } from "react";

export default function Task({task}) {
    dayjs.extend(relativeTime)
    dayjs.extend(updateLocale)
    dayjs.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'a few seconds',
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours ",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
    })
    // const ended_at = ((new Date()).toISOString()).toLocaleString()
    const startTime = dayjs(task.started_at).format('DD/MM/YYYY h:mm:ss A')

    const [time, setTime] = useState(dayjs().diff(dayjs(task.started_at)));
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isRunning) {
          // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
          intervalId = setInterval(() => setTime(() => {
            return dayjs().diff(dayjs(task.started_at))
          }), 1000);
        }
        return () => clearInterval(intervalId);
      }, [isRunning, time]);


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
                    <p className="font-bold">Time Spent On Ticket</p>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}