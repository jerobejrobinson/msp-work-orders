import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
    const jsonDirectory = path.join(process.cwd(), 'app', 'api', 'dist', 'getCustomerDataGeneral');

    const fileContents = await fs.readFile(jsonDirectory + '/test.json', 'utf8');

    const fileData = JSON.parse(fileContents)

    const cookieList = cookies()
    const token = cookieList.get('dist')

    if(!token) {
        return NextResponse.json({error: 'error getting token'})
    }

    const chain = fileData.map(async (obj: any, index: any) => {
        return await new Promise((resolve, reject) => {
            setTimeout(async () => {
                const res = await fetch(`${process.env.INFOR_API_URL}/sxapiARGetCustomerDataGeneralV2`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${token.value}`
                    },
                    body: JSON.stringify({
                        request: {
                            companyNumber: 3,
                            operatorInit: "jjr",
                            operatorPassword: "",
                            customerNumber: obj["account-number"],
                            requestType: 'general'
                        }
                    })
                }).then(data => data.json())
                resolve({ ...obj, lastSaleDate: res.response.lastSalesDate})
            }, index * 1000)
        })
    })

    const mainData = await Promise.all(chain)

    return NextResponse.json({status: 200, res: mainData})
}