import Form from './components/Form'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
export const dynamic = 'force-dynamic'
export default async function Page() {
    dayjs.extend(relativeTime)
    const supabase = await createServerComponentClient({ cookies })

    const {error, data} = await supabase.from('temp_serial_number').select('*')

    if(error) {
        console.log(error)
    }
    console.log(data)
    return (
        <section>
            <div className="flex flex-col justify-center h-24 w-full">
                <Form />
            </div>
                {/* grid header */}
            <div className='grid grid-cols-4 bg-sky-300 p-4'>
                <p>Date Added</p>
                <p>Part Number</p>
                <p>Serial Number</p>
                <p>Used</p>
            </div>
            {data?.map((row, index) => (
                <div className={`grid grid-cols-4 p-4 ${index % 2 == 0 ? 'bg-gray-100' : 'bg-gray-300'}`} key={row.id}>
                    <p>{dayjs(row.created_at).format('DD/MM/YYYY h:mm:ss A')}</p>
                    <p>{row.part_number}</p>
                    <p>{row.serial_number}</p>
                    <p>{row.used ? 'used' : 'available'}</p>
                </div>
            ))}
        </section>
    )
}