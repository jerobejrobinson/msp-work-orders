import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Technician from './components/Technician'
export default async function Page() {
    const supabase = await createServerComponentClient({ cookies })

    const {error, data: techs} = await supabase.from('technician').select('*')

    console.log(techs)
    return (
        <div className="p-4 mt-16 grid grid-cols-4 gap-4">
            {techs?.map((tech) => (
                <Technician tech={tech} key={tech.id} />
            ))}
        </div>
    )
}