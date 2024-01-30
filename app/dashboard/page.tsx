import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import WorkOrderTable from "@/components/WorkOrderTable"
import BillingChart from "@/components/BIllingChart"
export const revalidate = 0

export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })

    const { data: workOrderData } = await supabase.from('work_order').select('id, number, type, tracking_number, product_number, return_shipping, created_at, last_update_at, status')
    const { data: billingData } = await supabase.from('billing').select('id, created_at, amount').order('created_at', { ascending: true})
    if(!workOrderData) {
        return (
            <div>
                <p>No Active Work Orders</p>
            </div>
        )
    }

    function formatbillingData(data: []) {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let years = new Map()
        data.forEach(invoice => {
            // @ts-ignore
            const month = labels[new Date(invoice.created_at).getMonth()]
            // @ts-ignore
            const year = new Date(invoice.created_at).getFullYear()
            if(years.has(year)) {
                if(years.get(year).has(month)) {
                    const e = years.get(year).get(month)
                    // @ts-ignore
                    e.total += invoice.amount
                    e.wo += 1
                } else {
                    // @ts-ignore
                    years.get(year).set(month, {total: invoice.amount})
                }
            } else {
                let x = new Map()
                // @ts-ignore
                x.set(month, {total: invoice.amount, wo: 1})
                years.set(year, x)
            }
        })
        
        const labelsForChart = []
        const amountForChart = []
        const numForChart = []
        
        // @ts-ignore
        for ( let year of years.keys()) {
            for( let month of years.get(year).keys()) {
                labelsForChart.push(month)
                amountForChart.push(years.get(year).get(month).total)
                numForChart.push(years.get(year).get(month).wo)
            }
        }

        const chartData = {
            labels: labelsForChart,
            datasets: [
              {
                label: '($) Invoiced Amount',
                data: amountForChart,
                backgroundColor: 'rgba(321, 80, 61, 1)',
              },
            ],
        };

        return chartData
    }
    return (
        <div  className="h-main w-full bg-background flex flex-col items-center mt-16 space-y-8">
            {/* @ts-expect-error Server Component */}
            <WorkOrderTable data={workOrderData} admin={true}/>
            {/* @ts-ignore */}
            {/* {billingData && <BillingChart chart={formatbillingData(billingData)} />} */}
        </div>
    )
}