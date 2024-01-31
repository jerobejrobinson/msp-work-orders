import Link from "next/link"
import WorkOrderDownloadLink from "./WorkOrderDownloadLink"

export default async function WorkOrder({ wo }: { wo: any}) {
    return (
        <>
            {/* Work Order Details  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Details<span className="font-light text-md"> Last Updated - {new Date(wo.last_update_at).toString()}</span></p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    <div className="flex flex-col">
                        <p className="font-bold">Work Order Number</p>
                        <p>{wo.number}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Product Number</div>
                        <p>{wo.product_number}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Quanity</div>
                        <p>{wo.quanity}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Submission Date</div>
                        <p>{new Date(wo.created_at).toString()}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Work Order Type</div>
                        <p>{wo.type}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Carrier</div>
                        <p>{wo.carrier}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Shipping</div>
                        <p>{wo.shipping}</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold">Shipping Label</div>
                        {wo.return_shipping && <Link href={wo.return_shipping} rel="noopener noreferrer" target="_blank">Download Label</Link>}
                    </div>
                    {wo.tracking_number && (
                        <div className="flex flex-col">
                            <div className="font-bold">Tracking Number</div>
                            {wo.tracking_number}
                        </div>
                    )}
                </div>
            </div>
            {/* Part Issues  */}
            <div className="w-full max-w-7xl py-8">
                <p className="text-xl font-bold flex flex-row justify-between">Part Issues</p>
                <div className="grid grid-cols-4 gap-4 p-8 bg-white border rounded">
                    {wo.part_issues.map((issue: string, index: string) => (
                        <div key={index}>
                            {issue}
                        </div>
                    ))}
                    <div className="col-span-4">
                        <div className="font-bold">Details</div>
                        <p>{wo.details}</p>
                    </div>
                </div>
            </div>
        </>
    )
}