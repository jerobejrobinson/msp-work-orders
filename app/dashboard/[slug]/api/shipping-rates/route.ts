const shippo = require('shippo')('shippo_live_668093dd741b1a11190811f6492b0dba0ecb38b5')
// const shippo = require('shippo')('shippo_test_9be23c9f6bd8d9e43ec7a3a729189d0bfd89afea')
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

interface WorkOrder {
    id: string
    length: number
    height: number
    width: number
    weight: number
    return_shipping: string
    carrier: string
    customer: {
        email: string
        first_name: string
        last_name: string
        address: string
        address_2: string | null
        city: string
        state: string
        country: string
        company_name: string | null
        zip: number
        phone: number
    }
}

interface Admin {
    id: string
    first_name: string
    last_name: string
}

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const { data } = await supabase.auth.getUser()
    
    const { data: admin, error: adminError } = await supabase.from('admin').select('first_name, last_name').eq('user_id', data.user?.id).limit(1).single<Admin>()
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, number, return_shipping, length, width, height, weight, carrier, customer ( email, first_name, last_name, address, address_2, city, state, zip, phone, country, company_name )').eq('id', id).limit(1).single<WorkOrder>()
    
    if(woError) {
        console.log(woError)
        return NextResponse.json({status: 500, msg: "Could not retreive work order."})
    }

    if(adminError) {
        console.log(adminError)
        return NextResponse.json({status: 500, msg: "error retreiving a"})
    }

    var addressTo  = {
        "name": wo.customer.first_name + ' ' + wo.customer.last_name,
        "company": wo.customer.company_name ? wo.customer.company_name : '',
        "street1": wo.customer.address,
        "street2":wo.customer.address_2 ? wo.customer.address_2 : '',
        "city": wo.customer.city,
        "state": wo.customer.state,
        "zip": wo.customer.zip.toString(),
        "country": wo.customer.country,
        "email": wo.customer.email,
        "phone": wo.customer.phone.toString()
    };
    
    var addressFrom = {
        "name": "Domonique Woods",
        "street1": "3250 Millbranch Rd",
        "city": "Memphis",
        "state": "TN",
        "zip": "38116",
        "country": "US",
        "phone": "9013960710",
        "company": "MSP Diesel Solutions"
    };
    
    var parcel = {
        "length": wo.length.toString(),
        "width": wo.width.toString(),
        "height": wo.height.toString(),
        "distance_unit": "in",
        "weight": wo.weight.toString(),
        "mass_unit": "lb"
    };
    
    function getCarrierID(carrier: string) {
        if(carrier === 'fedex') {
            return process.env.SHIPPO_FEDEX_CARRIER_ID
        } else {
            return process.env.SHIPPO_UPS_CARRIER_ID
        }
    }

    const rates = await shippo.shipment.create({
        "address_from": addressFrom,
        "address_to": addressTo,
        "parcels": [parcel],
        "async": false,
        "extra": {"is_return": true},
        "carrier_accounts": [getCarrierID(wo.carrier)]
    }, function(err: any, shipment: any){
        let rate = shipment.rates;
        return rate
        // Purchase the desired rate.
        // shippo.transaction.create({
        //     "rate": rate.object_id,
        //     "label_file_type": "PDF",
        //     "async": false
        // }, function(err: any, transaction: any) {
        // asynchronous callback
        //     console.log(transaction)
        // });
    });

    // console.log(rates)
    return NextResponse.json({status: 200, rates})
    // console.log(shipping)

}