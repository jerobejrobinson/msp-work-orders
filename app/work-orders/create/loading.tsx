export default function Loading() {
    return (
        <div className='w-full bg-background flex flex-col items-center mt-16'>
            <h1 className="text-xl font-bold text-center p-4 bg-gray-300 text-gray-300 animate-pulse">Create New Work Order</h1>
            <form className="flex flex-col gap-4 bg-gray-300 text-gray-300 animate-pulse p-4 rounded border w-full max-w-4xl ">
                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="part-number" className="text-lg font-bold">Part Number: </label>
                    <input 
                        required 
                        type="text" 
                        id="part-number" 
                        name="product_number" 
                        placeholder="enter part number" 
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 "
                    />
                    <label htmlFor="quanity" className="text-lg font-bold">Quanity: </label>
                    <input 
                        required 
                        type="text" 
                        id="quanity" 
                        name="quanity" 
                        placeholder="enter quanity" 
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 "
                    />
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Part Issue</p>
                    <input 
                        type="checkbox" 
                        id="over-fuelingCheckbox" 
                        name="over-fueling" 
                        value="over-fueling"
                    />
                    <label className="col-span-3" htmlFor="over-fuelingCheckbox">Over-fueling</label>
                    
                    <input 
                        type="checkbox" 
                        id="under-fuelingCheckbox" 
                        name="under-fueling" 
                        value="under-fueling" 
                    />
                    <label className="col-span-3" htmlFor="under-fuelingCheckbox">Under-fueling</label>

                    <input 
                        type="checkbox" 
                        id="smokingCheckbox" 
                        name="smoking" 
                        value="smoking" 
                    />
                    <label className="col-span-3" htmlFor="smokingCheckbox">Smoking</label>

                    <input 
                        type="checkbox" 
                        id="timingCheckbox" 
                        name="timing" 
                        value="timing" 
                    />
                    <label className="col-span-3" htmlFor="timingCheckbox">Timing Issues</label>

                    <input 
                        type="checkbox" 
                        id="leakingCheckbox" 
                        name="leaking" 
                        value="leaking" 
                    />
                    <label className="col-span-3" htmlFor="leakingCheckbox">Leaking</label>

                    <input 
                        type="checkbox" 
                        id="startingCheckbox" 
                        name="starting" 
                        value="starting" 
                    />
                    <label className="col-span-3" htmlFor="startingCheckbox">Starting</label>

                    <input 
                        type="checkbox" 
                        id="runningCheckbox" 
                        name="running" 
                        value="running" 
                    />
                    <label className="col-span-3" htmlFor="runningCheckbox">Running rough</label>

                    <input  
                        type="checkbox" 
                        id="otherCheckbox"
                        name="other" 
                        value="other" 
                    />
                    <label className="col-span-3" htmlFor="otherCheckbox">Other</label>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="extraDetails" className="text-lg font-bold">Additional Details</label>
                    <textarea 
                        required 
                        name="details" 
                        id="extraDetaisl" 
                        cols={30} 
                        rows={10} 
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 " 
                                ></textarea>
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Carrier</p>
                    <input 
                        type="radio" 
                        name="carrier" 
                        id="fedex" 
                        value="fedex"
                    />
                    <label  className="col-span-3" htmlFor="fedex">Fedex</label>
                    <input 
                        type="radio" 
                        name="carrier" 
                        id="ups" 
                        value="ups"
                    />
                    <label  className="col-span-3" htmlFor="ups">UPS</label>
                </div>
                <div className="grid grid-cols-4 gap-y-2">
                    <p className="text-lg font-bold col-span-4">Select Shipping</p>
                    <input 
                        type="radio" 
                        name="shipping" 
                        id="standard" 
                        value="standard"
                    />
                    <label  className="col-span-3" htmlFor="standard">Standard Ground (No Charge)</label>
                    <input 
                        type="radio" 
                        name="shipping" 
                        id="next-day" 
                        value="next day"
                    />
                    <label  className="col-span-3" htmlFor="next-day">Expedited Next Day ($50 Upcharge)</label>
                </div>
                <div className="grid grid-cols-3 gap-y-2">
                    <p className="text-lg font-bold col-span-3">Select Work Order Type</p>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            id="test-only" 
                            value="test only" 
                            className=" mr-4"
                    />
                        <label htmlFor="test-only">Test Only</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            id="repair" 
                            value="repair" 
                            className="mr-4"
                        />
                        <label htmlFor="repair">Repair</label>
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            name="type" 
                            id="reman" 
                            value="reman" 
                            className="mr-4"
                        />
                        <label htmlFor="reman">Reman</label>
                    </div>
                </div>
                <button type="submit" className="bg-main w-full p-4 text-white text-lg font-bold">
                    Submit Work Order
                </button>
            </form>
        </div>
    )
}