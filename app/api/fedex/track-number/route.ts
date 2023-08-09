import { NextResponse } from "next/server"
export async function GET(request: Request) {
    const data = await fetch('https://apis-sandbox.fedex.com/track/v1/trackingnumbers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDWFMtVFAiXSwiUGF5bG9hZCI6eyJjbGllbnRJZGVudGl0eSI6eyJjbGllbnRLZXkiOiJsNzBhYzU1YWU5YzgyNTRiZTY5Y2JhYTAzOTM1NjcyNjllIn0sImF1dGhlbnRpY2F0aW9uUmVhbG0iOiJDTUFDIiwiYWRkaXRpb25hbElkZW50aXR5Ijp7InRpbWVTdGFtcCI6IjA4LUF1Zy0yMDIzIDE2OjI2OjA0IEVTVCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJhcGltb2RlIjoiU2FuZGJveCIsImN4c0lzcyI6Imh0dHBzOi8vY3hzYXV0aHNlcnZlci1zdGFnaW5nLmFwcC5wYWFzLmZlZGV4LmNvbS90b2tlbi9vYXV0aDIifSwicGVyc29uYVR5cGUiOiJEaXJlY3RJbnRlZ3JhdG9yX0IyQiJ9LCJleHAiOjE2OTE1MzM1NjQsImp0aSI6IjlmMTM3ZDhmLTE4MGQtNGI4OS04Njk2LTlkM2Q5MTFlYjg4MCJ9.m_8rv2GClmBVdejaaiGVkcytb3pInPrYsD0JpY4_xP9oj3uqC9i2XrEBvPoF6OEF0G7n5HKCAzeYc1AmyOdeYpqrbbGmqDhhxUDh6PYrfWvR_LYgBvzdAWMfThdNs3GPXd53hZ-saCt0yTP3J59koa2O2BYxa5XMr_TLFYSVyVQIBHbNcpDKVvSpJF-LRzEv8LGN8-U5BOVFX1epcfiTe5n7TSt9wG6Fgqncd9-XgZF157HFmsbFYLFFWkiCm7f5VcI0G2J9ZWDWG2nedViMBH86fWXtev2HlMboWtf-xpMmFjTnWY54revR1iMGUg5HaXvHb-b-vGGhOlrsWa3_8hVfvlsXlcpJV_KRD5PhwOoyOkuAxmeZR2V2xH5omY_tZvNmRNm8VXUeuuaXgA27_LV_HmJjTX-T3nz3wbJIsR-shK6wkrf3ctE5WK8r4ZdS1kNGrhqkGNX_f8HmoYnwIGaQKpTwmFLWhrjK8qsaDCnVDSa7IerKcwe0q6-_QY2hvNDvFH3oFZA2cuDtmx7DaF1rOl2bx6r73ExisYDAbh1bwP5H7C8gNNFx-_jWq9vVzIaq883UNz6eDH6ikspUDzR1AAwPZbgQMLwzAmFqQp6S7Gx4xBaBPFZtCUt5dfooMeheZQBcrHGa4oGhPDv7IUnPoO_Wky_0clRfm9bekHs'
        },
        body: JSON.stringify({
            includeDetailedScans: false,
            trackingInfo: [
                {
                    trackingNumberInfo: {
                        trackingNumber: '656612959679'
                    } 
                }
            ]
        })
    }).then(data => data.json())

    if(data.output) {
        return NextResponse.json(data)
    }
}