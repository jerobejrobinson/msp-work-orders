'use client'
import { useState, useEffect} from "react"
import { hasCookie } from 'cookies-next';

interface DateAndTimes {
   type: string;
   dateTime: string;
}
export default function FedexTracking({ wo }:{wo: any}) {
   const [loading, setLoading] = useState<boolean>(false)
   const [shippingData, setShippingData] = useState<[DateAndTimes] | null>(null)
   const handleGetShipping = async () => {
      setLoading(true)
      const data = await fetch(`http://localhost:3000/api/fedex/track-number?tn=${wo.return_tracking_number}`).then(data => data.json())
      setShippingData(data)
      setLoading(false)
   }
   
   useEffect(() => {
      const fedex = hasCookie('fedex')
      if(!fedex) {
         fetch('/api/fedex')
      }
   })
   if(loading) {
      return (
         <div className="grid grid-cols-5 bg-gray-400 text-gray-400 w-full max-w-7xl p-4 border rounded animate-pulse">
            <div>
               <p>x</p>
               <p>x</p>
            </div>
         </div>
      )
   }
   if(!shippingData) {
      return (
         <div className="w-full max-w-7xl">
            <button className="p-4 bg-main text-white rounded" onClick={() => handleGetShipping() }>Get Shipping Data</button>
         </div>
      )
   }
   return (
      <>
         <div className="grid grid-cols-5 bg-white w-full max-w-7xl p-4 border rounded">
            {shippingData.slice(0).reverse().map((obj, index) => (
               <div key={index}>
                  <p>{obj.type}</p>
                  <p>{new Date(obj.dateTime).toLocaleDateString() + ", " + new Date(obj.dateTime).toLocaleTimeString()}</p>
               </div>
            ))}
         </div>
         <div className="w-full max-w-7xl">
            <p className="text-sm flex flex-row justify-between">* Data is pulled from Fedex Track API</p>
         </div>
      </>
   )
}