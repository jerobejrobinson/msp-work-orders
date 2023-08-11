export default function Loading() { 
    return (
        <div className="min-h-main w-full bg-background flex flex-col items-center relative mt-16">
            <div className="w-full max-w-7xl py-8">
                <div className="w-full flex justify-between">
                    <button
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center animate-pulse"
                    >
                        back
                    </button>
                    <div className="flex flex-row gap-4">
                        <button
                            className="py-2 px-4 rounded-md no-underline bg-btn-background text-btn-background hover:bg-btn-background-hover flex flex-row items-center animate-pulse"
                        >
                            Actions
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-7xl">
                <button className="p-4 bg-btn-background rounded animate-pulse text-btn-background">Get Shipping Data</button>
            </div>
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Status</p>
                <div className="grid grid-cols-6 bg-white rounded border">
                    <div className="p-4 flex justify-center bg-gray-300 rounded animate-pulse text-gray-300">Submitted</div>
                    <div className={`p-4 border-l-2 flex justify-center bg-gray-300 animate-pulse text-gray-300`}>Received</div>
                    <div className={`p-4 border-l-2 flex justify-center bg-gray-300 animate-pulse text-gray-300`}>tested</div>
                    <div className={`p-4 border-l-2 flex justify-center bg-gray-300 animate-pulse text-gray-300`}>Billed</div>
                    <div className={`p-4 border-l-2 flex justify-center bg-gray-300 animate-pulse text-gray-300`}>Work In Progress</div>
                    <div className="p-4 border-l-2 flex justify-center bg-gray-300 animate-pulse text-gray-300">Shipped</div>
                </div>
            </div>
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between items-center gap-4">Details <span className="font-light text-md w-full h-4 bg-gray-300 rounded animate-pulse"></span></p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    <div className="flex flex-col">
                        <p className="font-bold">Work Order Number</p>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Product Number</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Quanity</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Submission Date</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Work Order Type</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Carrier</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Shipping</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Shipping Label</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                </div>
            </div>
            {/* Part Issues  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Part Issues</p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    <div  className="h-4 w-full bg-gray-200 animate-pulse rounded" ></div>
                    <div className="col-span-4">
                        <div className="font-bold">Details</div>
                        <p className="h-4 w-full bg-gray-300 rounded animate-pulse"></p>
                    </div>
                </div>
            </div>
            {/* Work Order Notes  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Notes</p>
                <div className="bg-white border rounded">
                    
                </div>
            </div>
            {/* Test Results  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Test Results</p>
                <div className="bg-white border rounded">
                    
                </div>
            </div>
            {/* Billing Status */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Billing Status</p>
                <div className="bg-white border rounded">
                    <div className="italic font-light text-3xl p-4 flex flex-row justify-center items-center">
                        Billing not available yet
                    </div>
                </div>
            </div>
        </div>
    )
}