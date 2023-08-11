import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: Request) {
    const supabase = await createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('wId')

    interface WorkOrder {
        id: string
        shipping: string
        customer: {
            email: string
            first_name: string
            last_name: string
            address: string
            address_2: string
            city: string
            state: string
            country: string
            company_name: string
            zip: number
            phone: number
        }
    }
    
    // @ts-ignore
    const { data: wo, error: woError } = await supabase.from('work_order').select('id, shipping, customer ( email, first_name, last_name, address, address_2, city, state, country, company_name, zip, phone )').eq('id', id).limit(1).single<WorkOrder>()
    
    if(!wo) {
        return NextResponse.json({message: 'work order does not exist'})
    }
    const jwt = cookies()
    const fedex = jwt.get('fedex')

    if(!fedex) {
        return NextResponse.json({message: 'token not found'})
    }

    const data = await fetch('https://apis-sandbox.fedex.com/ship/v1/shipments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${fedex.value}`
        },
        body: JSON.stringify({
            requestedShipment: {
                shipper: {
                    address: {
                        streetLines: wo.customer.address_2 ? [wo.customer.address, wo.customer.address_2] : [wo.customer.address],
                        city: wo.customer.city,
                        stateOrProvinceCode: wo.customer.state,
                        postalCode: wo.customer.zip,
                        countryCode: wo.customer.country
                    },
                    contact: {
                        phoneNumber: wo.customer.phone,
                        companyName: wo.customer.company_name,
                        personName: `${wo.customer.first_name} ${wo.customer.last_name}`
                    }
                },
                recipients: [
                    {
                        address: {
                            streetLines: ['3250 Millbranch Rd'],
                            city: 'Memphis',
                            stateOrProvinceCode: 'TN',
                            postalCode: '38116',
                            countryCode: 'US'
                        },
                        contact: {
                            phoneNumber: '9013960710',
                            personName: "Domonique Woods"
                        }
                    }
                ],
                pickupType: 'CONTACT_FEDEX_TO_SCHEDULE',
                serviceType: wo.shipping === 'standard' ? 'FEDEX_GROUND' : 'FIRST_OVERNIGHT',
                packagingType: 'YOUR_PACKAGING',
                shippingChargesPayment: {
                    paymentType: 'SENDER'
                },
                shipmentSpecialServices: {
                    specialServiceTypes: ['RETURN_SHIPMENT'],
                    returnShipmentDetail: {
                        returnType: "PRINT_RETURN_LABEL",
                        rma: {
                            reason: "test/repair/reman"
                        }
                    }
                },
                labelSpecification: {
                    labelStockType: 'PAPER_85X11_TOP_HALF_LABEL',
                    imageType: 'PDF',
                },
                requestedPackageLineItems: [
                    {
                        weight: {
                            units: 'LB',
                            value: 15.00
                        }
                    }
                ],
            },
            labelResponseOptions: "URL_ONLY",
            accountNumber: {
                value: '740561090'
            },
        })
    }).then(data => data.json())
    
    return NextResponse.json(data)
}