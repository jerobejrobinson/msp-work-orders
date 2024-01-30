
const shippo = require('shippo')('shippo_live_668093dd741b1a11190811f6492b0dba0ecb38b5')
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    // UPS : 447bb610cd56410d8518f08715c7c859
    const fedex = await shippo.carrieraccount.retrieve('7d878e1d353546739779bddf88fb1720')
    return NextResponse.json({status: 200, fedex})
}