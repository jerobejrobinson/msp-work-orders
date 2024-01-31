'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'next/navigation'
import WorkOrderForm from "@/components/WorkOrderForm"

export default async function Page() {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const params = useParams()
    
    const { data: { user }} = await supabase.auth.getUser()
    
    if(!user) {
        router.push('/login')
    }

    const { data: admin  } = await supabase.from('admin').select('user_id, id').eq('user_id', user?.id).limit(1).single()

    if(!admin) {
        router.push('/')
    }

    const { data: wo } = await supabase.from('work_order').select().eq('id', params.slug).limit(1).single()

    // if(!wo) {
    //     notFound()
    // }
    return (
        <PDFDownloadLink document={<WorkOrderForm wo={wo}/>} fileName={`"fuel-shop-repair-order-forms | ${((new Date()).toISOString()).toLocaleString()}.pdf`}>
            {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download now!'
            }
        </PDFDownloadLink>
    )
}