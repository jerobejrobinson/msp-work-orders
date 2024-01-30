const shippo = require('shippo')('shippo_live_668093dd741b1a11190811f6492b0dba0ecb38b5')
// const shippo = require('shippo')('shippo_test_9be23c9f6bd8d9e43ec7a3a729189d0bfd89afea')
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    //id = Rate Object From shippo.shipment.create
    const id = searchParams.get('id')
    const label = await shippo.transaction.create({
        "rate": id,
        "label_file_type": "PDF",
        "async": false
    }, function(err: any, transaction: any) {
      // asynchronous callback
      return transaction
    });
    console.log(label)
    return NextResponse.json({status: 200, label})
}