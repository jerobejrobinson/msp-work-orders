import React from 'react';
import { PDFViewer, Document, Page, Image, Text} from '@react-pdf/renderer';

export default function WorkOrderForm({wo, customer}) {
    return (

            <Document>
                    <Page size={{width: 1275, height: 1650}}>
                        <Image src={`https://uyiqxkpetrujkobtyyzl.supabase.co/storage/v1/object/public/public/template.jpg`} />
                        <Image src={`https://uyiqxkpetrujkobtyyzl.supabase.co/storage/v1/object/public/public/300.png`} style={{width: '175px', height: '85px', top: '22px', left: '86px', position: 'absolute'}}/>
                        <Image src={`http://bwipjs-api.metafloor.com/?bcid=code128&text=${wo.number}&parsefnc&alttext=${wo.number}`} style={{width: '128px', height: '113px', top: '17px', left: '1015px', position: 'absolute'}}/>
                        <Text style={{position: 'absolute', top: '198px', left: '131px', fontSize: '20px'}}>
                            {wo.customer.first_name + ' ' + wo.customer.last_name}
                        </Text>
                        <Text style={{position: 'absolute', top: '198px', left: '644px', fontSize: '20px'}}>
                            {wo.customer.account_number}
                        </Text>
                        <Text style={{position: 'absolute', top: '230px', left: '160px', fontSize: '20px'}}>
                            {wo.customer.address}
                        </Text>
                        <Text style={{position: 'absolute', top: '230px', left: '625px', fontSize: '20px'}}>
                            {wo.customer.city} {wo.customer.state} {wo.customer.zip}
                        </Text>
                        <Text style={{position: 'absolute', top: '269px', left: '141px', fontSize: '20px'}}>
                            {wo.customer.phone}
                        </Text>
                        <Text style={{position: 'absolute', top: '269px', left: '565px', fontSize: '20px'}}>
                            {wo.customer.cell | null}
                        </Text>
                        <Text style={{position: 'absolute', top: '270px', left: '977px', fontSize: '20px'}}>
                            {wo.product_number}
                        </Text>
                    </Page> 
            </Document>

    )
}
{/* {orderedParts && orderedParts.map((part, i) => {
    const postion = 464 + (i * 40)
    return (
        <>
            <Text key={i + 1} style={{position: 'absolute', top: `${postion}px`, left: '56px', fontSize: '20px'}}>
                {part.quanity}
            </Text>
            <Text key={i + 2} style={{position: 'absolute', top: `${postion}px`, left: '129px', fontSize: '20px'}}>
                {part.part_number}
            </Text>
            <Text key={i + 3} style={{position: 'absolute', top: `${postion}px`, left: '330px', fontSize: '20px'}}>
                {part.description}
            </Text>
            <Text key={i + 4} style={{position: 'absolute', top: `${postion}px`, left: '703px', fontSize: '20px'}}>
                {part.amount}
            </Text>
        </>
    )
})} */}