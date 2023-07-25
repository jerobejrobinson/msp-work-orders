export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center mt-16">
            <div className="w-full max-w-7xl flex justify-between pt-8">
                <button
                    
                    className="py-2 px-4 rounded-md no-underline flex flex-row items-center bg-gray-300 animate-pulse text-gray-300"
                >
                    Back
                </button>
                <button
                    
                    className="py-2 px-4 rounded-md no-underline flex flex-row items-center bg-gray-300 animate-pulse text-gray-300"
                >
                    Create New Work Order
                </button>
            </div>
            <div className="w-full max-w-7xl flex flex-col gap-4 pt-8">
                {[{id: "i", number: "78954", product_number: "0986435505"}, 
                {id: "2", number: "78954", product_number: "0986435505"}, 
                {id: "3", number: "78954", product_number: "0986435505"}
                ].map(wo => (
                    <button 
                        className=" border rounded w-full grid grid-cols-2 p-4 bg-gray-300 animate-pulse"
                        key={wo.id}
                    >
                        <div className="bg-gray-300 animate-pulse text-gray-300">{wo.number}</div>
                        <div className="bg-gray-300 animate-pulse text-gray-300">{wo.product_number}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}