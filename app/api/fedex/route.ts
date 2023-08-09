import { NextResponse } from "next/server"
export async function GET(request: Request) {
    const credentials = {
        grant_type: 'client_credentials',
        client_id: 'l70ac55ae9c8254be69cbaa0393567269e',
        client_secret: '69c39685e36747b6bc36014b72b5fad5',
    }

    const formBody = Object.keys(credentials).map(key => encodeURIComponent(key) + '=' + encodeURIComponent((credentials as any)[key])).join('&')
    const data = await fetch("https://apis-sandbox.fedex.com/oauth/token", {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
    }).then(data => data.json())

    console.log(data)
}