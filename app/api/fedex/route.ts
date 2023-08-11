import { NextResponse } from "next/server"
export async function GET(request: Request) {
    // Prod Keys
    // const credentials = {
    //     grant_type: 'client_credentials',
    //     client_id: process.env.PROD_FEDEX_CLIENT_ID,
    //     client_secret: process.env.PROD_FEDEX_CLIENT_SECRET,
    // }
    const credentials = {
        grant_type: 'client_credentials',
        client_id: 'l70ac55ae9c8254be69cbaa0393567269e',
        client_secret: '69c39685e36747b6bc36014b72b5fad5',
    }


    const formBody = Object.keys(credentials).map(key => encodeURIComponent(key) + '=' + encodeURIComponent((credentials as any)[key])).join('&')
    const prod = 'https://apis.fedex.com/oauth/token'

    const sandbox = 'https://apis-sandbox.fedex.com/oauth/token'
    const data = await fetch(sandbox, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
    }).then(data => data.json())

    if(data.errors) {
        return NextResponse.json(data)
    } 

    console.log(data)

    let res = NextResponse.json({status: 200})

    res.cookies.set('fedex', data.access_token, { maxAge: data.expires_in})
    
    return res
}