'use client'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from "next/image";

export default async function Images({ images }: {images: any}) {
    // const supabase = createClientComponentClient()
    // const { data: { user } } = await supabase.auth.getUser()
    return (
        <div className="w-full max-w-7xl py-8">
            <p className="text-xl font-bold flex flex-row justify-between">Images</p>
            <div className="container mx-auto bg-white border rounded flex flex-wrap p-8 justify-between">
                    {!images?.length  && (
                        <div className=" italic font-light text-3xl p-4 flex flex-row pl-8 items-center">
                            No Images Available Yet
                        </div>
                    )}
                    {images && images.length > 0 && images.map((img: any) => (
                        <div className=" w-64 h-64 p-1 md:p-2 relative" key={img.id}>
                            <Image
                                alt={img.created_at.toString()}
                                src={img.url}
                                fill={true}
                                style={{objectFit: "contain"}}
                            />
                            <p className=" bg-gray-900 bg-opacity-75 text-white p-2 absolute bottom-0">Uploaded | {new Date(img.created_at).toLocaleString()}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}