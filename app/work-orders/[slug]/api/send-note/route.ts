import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail'

export async function POST(request: Request) {
    // @ts-ignore
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY)
    
    const { email } = await request.json()

    const msg = {
        from: email,
        to: 'jrobinson@mspdieselsolutions.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email Sent')
    })
    .catch((error) => {
        console.error(error)
    })
}