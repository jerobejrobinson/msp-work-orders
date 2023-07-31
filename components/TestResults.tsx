import Link from "next/link"

interface TestResult {
    id: string,
    created_at: Date,
    note: string,
    admin: { first_name: string } | null,
    link: string
}

export default async function TestResults({ test_results }: { test_results: [TestResult]}) {
    return (
        <div className="w-full max-w-7xl py-8">
            <p className="text-xl font-bold flex flex-row justify-between">Test Results</p>
            <div className="bg-white border rounded">
                {test_results && test_results.length > 0 && test_results.map((test, index) => {
                    return (
                        <div className={`${index % 2 === 0 ? 'bg-gray-200' : ''} p-4`} key={index}>
                            <Link className="col-span-2 p-2 font-bold" href={test.link}>View PDF</Link>
                            <div className="col-span-2 p-2">{test.note}</div>
                            <div className="italic">{new Date(test.created_at).toString()}</div>
                            <div className="p-2"><span className="font-bold">Uploaded By</span> - {test.admin?.first_name}</div>
                        </div>
                    )
                })}
                {!test_results?.length  && (
                    <div className=" italic font-light text-3xl p-4 flex flex-row pl-8 items-center">
                        No Test Results Available Yet
                    </div>
                )}
            </div>
        </div>
    )
}