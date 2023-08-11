import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
    const jwt = cookies()
    const fedex = jwt.get('fedex')
    if(!fedex) {
        return NextResponse.json({message: 'token not found'})
    } 
    
    const data = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${fedex.value}`
        },
        body: JSON.stringify({
            includeDetailedScans: false,
            trackingInfo: [
                {
                    trackingNumberInfo: {
                        trackingNumber: new URL(request.url).searchParams.get('tn')
                    } 
                }
            ]
        })
    }).then(data => data.json())

    
    if(data.errors) {
        return NextResponse.json({message: data.errors[0].message})
    }
    
    return NextResponse.json(data.output.completeTrackResults[0].trackResults[0].dateAndTimes)
}