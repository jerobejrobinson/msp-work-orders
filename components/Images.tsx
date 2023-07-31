import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface Image {
    id: string,
    wo_id: string,
    created_at: Date,
    url: string,
    type: string
}

export default async function Images({ wo }: {wo: any}) {
    const supabase = createServerComponentClient({ cookies })
    const { data: images, error: imagesError } = await supabase.from('image').select('*').eq('wo_id', wo.id).returns<[Image]>()
    return (
        <div className="w-full max-w-7xl py-8">
            <p className="text-xl font-bold flex flex-row justify-between">Images</p>
            <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12 bg-white border rounded">
                <div className="-m-1 flex flex-wrap md:-m-2">
                    {images && images.length > 0 && images.map((img) => (
                        <div key={img.id} className="flex w-1/3 flex-wrap">
                            <div className="w-full p-1 md:p-2 relative">
                                <img
                                alt={img.created_at.toString()}
                                className="block w-full rounded-lg object-contain object-center h-52"
                                src={img.url} />
                                <p className=" bg-gray-900 bg-opacity-75 text-white p-2 absolute bottom-0">Uploaded | {new Date(img.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}