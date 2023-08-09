import Link from "next/link"

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    return (
        <div className="w-full h-main bg-background flex flex-col items-center mt-16">
            <div className="w-full max-w-7xl py-8">
                <div className="w-full flex justify-end">
                    <Link
                        href={`/work-orders/${searchParams?.id}`}
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                    >
                        View Work Order
                    </Link>
                </div>
            </div>
            <div className="bg-white rounded p-8 space-y-4 shadow">
                <h1 className="text-2xl font-bold">Your submission was successful!</h1>
                <p>You will be provided a shipping label shortly, we will update you when that happens.</p>
                <p>In the meantime, please download and complete our packing slip.</p>
                <div className="!mt-16">
                    <Link 
                        href="/assets/mspShippingDoc.pdf"
                        className="py-4 px-4 rounded-md no-underline bg-main hover:bg-mainT20 flex flex-row items-center text-white font-bold justify-center"
                    >Packing Slip</Link>
                </div>
            </div>
        </div>
    )
}