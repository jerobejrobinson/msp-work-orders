import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Technician from './components/Technician'
import AddTechBtn from './components/AddTechBtn'
export const dynamic = 'force-dynamic'

export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })

    const {error, data: techs} = await supabase.from('technician').select('*').eq('is_active', true)

    return (
        <div className="p-4 mt-16 space-y-4">
            <div>
                <AddTechBtn />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {techs?.map((tech) => (
                    <Technician tech={tech} key={tech.id} />
                ))}
            </div>
        </div>
    )
}