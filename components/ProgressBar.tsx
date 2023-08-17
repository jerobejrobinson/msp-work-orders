export default async function ProgressBar({wo, test_results, billing}: {wo: any, test_results: any, billing: any}) {
    const recieved = () => {
        // shipping label has not been submitted
        if(!wo.return_shipping) {
            return ''
            // shipping label has been submitted
        } else if(wo.number === 'pending') {
            return 'bg-greenLight text-white animate-pulse'
            // work order number has been submitted
        } else {
            return 'bg-greenLight text-white'
        }
    }

    const tested = () => {
        //work order number has been submitted
        if(test_results?.length) {
            return 'bg-greenLight text-white'
        }
        if(wo.number !== 'pending' && !test_results?.length) {
            return 'bg-greenLight text-white animate-pulse'
        } else {
            return ''
        }
    }

    const billed = () => {
        //work order number has been submitted
        if(billing) {
            return 'bg-greenLight text-white'
        }
        if(!billing && test_results?.length) {
            return 'bg-greenLight text-white animate-pulse'
        } else {
            return ''
        }
    }

    const workInProgress = () => {
        if(!billing) return ''
        if(billing.approved) {
            return 'bg-greenLight text-white'
        }else {
            return 'bg-greenLight text-white animate-pulse'
        }
    }

    const shipped = () => {
        if(!billing) return ''
        if(billing.approved && !wo.tracking_number) {
            return 'bg-greenLight text-white animate-pulse'
        }else if(billing.approved && wo.tracking_number) {
            return 'bg-greenLight text-white'
        } else {
            return ''
        }
    }
    return (
        <div className="w-full max-w-7xl py-8">
            <p className="text-xl font-bold flex flex-row justify-between">Status</p>
            {wo.type !== 'test only' ? (
                <div className="grid grid-cols-6 bg-white rounded border">
                    <div className="p-4 flex justify-center bg-[#90EE90] text-white rounded-l">Submitted</div>
                    <div className={`p-4 border-l-2 flex justify-center ${recieved()}`}>Received</div>
                    <div className={`p-4 border-l-2 flex justify-center ${tested()}`}>tested</div>
                    <div className={`p-4 border-l-2 flex justify-center ${billed()}`}>Billed</div>
                    <div className={`p-4 border-l-2 flex justify-center ${workInProgress()}`}>Work In Progress</div>
                    <div className={`p-4 border-l-2 flex justify-center ${shipped()}`}>Shipped</div>
                </div>
                ): <div className="grid grid-cols-5 bg-white rounded">
                    <div  className="p-4 flex justify-center bg-[#90EE90] text-white">Submitted</div>
                    <div className={`p-4 border-l-2 flex justify-center ${recieved()}`}>Recieved</div>
                    <div className={`p-4 border-l-2 flex justify-center ${tested()}`}>Tested</div>
                    <div className={`p-4 border-l-2 flex justify-center ${billed()}`}>Billed</div>
                    <div className={`p-4 border-l-2 flex justify-center ${shipped()}`}>Shipped</div>
                </div> 
            }
        </div>
    )
}