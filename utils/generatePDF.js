const PDFDocument = require('pdfkit');
const JsBarcode = require('jsbarcode');
const { createCanvas } = require('canvas');
const concat = require('concat-stream')

const createPDF = (imgBuffer, qty, base, wh, task, template = null, products = null, serial = null) => {
    const list = [];
    return new Promise((resolve, reject) => {
        const whBarcode = createCanvas();
        const woBarcode = createCanvas();
        
        const doc = new PDFDocument({size: 'LETTER', bufferPages: true, autoFirstPage: false});

        const writableStream = concat((data) => {
            resolve({data , list})
        })
        doc.pipe(writableStream);
        // Add for loop
        for(let x = 0; x < qty; x++) {
            list.push({woNumber: base + 1 + x, warehouse: wh, task})
            doc.addPage()
            JsBarcode(whBarcode, wh);
            JsBarcode(woBarcode, `${base + 1 + x }`);
            doc.image(whBarcode.toDataURL(), 41.4, 10.8, {width: 81.4});
            doc.image(imgBuffer, 146.9, 2.9, {width: 58})
            doc.font('Helvetica-Bold');
            doc.fontSize(15.6)
            doc.text('FUEL SHOP REPAIR ORDER', 216, 9.2, {
                width: 212.4,
                align: 'center'
            } )
            doc.font('Helvetica');
            doc.fontSize(11.2)
            doc.text('3250 Millbranch - Memphis, TN 38116', 216, 28.8, {
                width: 212.4,
                align: 'center'
            } )
            doc.text('P: 901-396-0750 | F: 800-650-7712', 216, 41.8, {
                width: 212.4,
                align: 'center'
            } )
            doc.font('Helvetica-Bold');
            doc.fontSize(11)
            doc.text('Date', 216, 65)
            doc.font('Helvetica')
            doc.text('                                                                                                                    ',
            242, 65, {
                width: 180,
                height: 2,
                underline: true
            })

            doc.image(woBarcode.toDataURL(), 486, 7.9, {width: 75, height: 60});

            doc.lineWidth(2);

            // Customer Info Box
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(21.2, 78, 383.4, 108.7).stroke()
            doc.font('Helvetica-Bold');
            doc.fontSize(14)
            doc.text('CUSTOMER INFO', 26.2, 83, {
                align: 'left',
                width: 200,
            })
            doc.font('Helvetica');
            doc.fontSize(12)
            // Name and Under Line
            doc.text('Name', 26.2, 102, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            60.2, 102, {
                width: 200,
                height: 2,
                underline: true
            })

            // Acct# and Under Line
            doc.text('Acct#', 270, 102, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            305, 102, {
                width: 90,
                height: 2,
                underline: true
            })

            // Address and Under Line
            doc.text('Address', 26.2, 120, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            71, 120, {
                width: 165,
                height: 2,
                underline: true
            })

            // City/St/Zip and Under Line
            doc.text('City/St/Zip', 237, 120, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            295, 120, {
                width: 100,
                height: 2,
                underline: true
            })

            // Phone and Under Line
            doc.text('Phone', 26.2, 138, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            62, 138, {
                width: 172,
                height: 2,
                underline: true
            })

            // Cell and Under Line
            doc.text('Cell', 237, 138, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            260, 138, {
                width: 135,
                height: 2,
                underline: true
            })

            // contact and Under Line
            doc.text('Contact', 26.2, 156, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            69, 156, {
                width: 172,
                height: 2,
                underline: true
            })

            // blank and Under Line
            doc.text('                                                                                                                    ',
            295, 156, {
                width: 100,
                height: 2,
                underline: true
            })

            // comment and underline
            doc.text('Comment', 26.2, 174, {
                align: 'left',
            })
            doc.text('                                                                                                                    ',
            79, 174, {
                width: 315,
                height: 2,
                underline: true
            })

            // Fuel Pump / injecters Box
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(410.8, 78, 179.6, 109.1).stroke()
            doc.font('Helvetica-Bold');
            doc.fontSize(12)
            doc.text('FUEL PUMP / INJECTORS', 415.8, 83, {
                align: 'left',
                width: 150,
            })
            doc.font('Helvetica');
            doc.fontSize(12)
            doc.text('Make / Model', 415.8, 107, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            490, 107, {
                width: 95,
                height: 2,
                underline: true
            })
            doc.text('Product #', 415.8, 131, {
                align: 'left',
                width: 150,
            })
            doc.text(template, 475, 131, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            470, 131, {
                width: 115,
                height: 2,
                underline: true
            })
            doc.text('Serial #', 415.8, 155, {
                align: 'left',
                width: 150,
            })
            doc.text(serial, 465, 155, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            460, 155, {
                width: 125,
                height: 2,
                underline: true
            })

            // Quote Amt Box
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.fontSize(12)
            doc.rect(410.8, 193.8, 179.6, 85.5).stroke()
            doc.text('Quoted Amt', 415.8, 202.8, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            482.8, 202.8, {
                width: 103,
                height: 2,
                underline: true
            })
            doc.text('Quote Date', 415.8, 222.8, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            480.8, 222.8, {
                width: 105,
                height: 2,
                underline: true
            })
            doc.text('Date Approved', 415.8, 242.8, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            497.8, 242.8, {
                width: 87,
                height: 2,
                underline: true
            })
            doc.text('Job Promised', 415.8, 262.8, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            490.8, 262.8, {
                width: 95,
                height: 2,
                underline: true
            })

            // Purchase orders On Job Box
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(410.8, 284.4 , 179.6, 144.7).stroke()
            doc.font('Helvetica-Bold');
            doc.fontSize(12)
            doc.text('Purchase Orders on job', 415.8, 289.4, {
                align: 'left',
                width: 150,
            })

            doc.font('Helvetica');
            doc.text('Vendor', 415.8, 310.4, {
                align: 'left',
                width: 150,
            })
            const alpha = ['A', 'B', "C", 'D', 'E']
            for(let x = 0; x < 5; x++) {
                let add = 18 * x;
                let y = 330 + add
                doc.text('                                                                                                                    ',
                415.8, y, {
                    width: 150,
                    height: 2,
                    underline: true
                })
                doc.font('Helvetica-Bold');
                doc.text(alpha[x],
                570, y + 2, {
                    width: 150,
                    height: 2,
                })

            }

            // Part Added Box 1
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(410.8, 433.8, 179.6, 46.8).stroke()
            doc.font('Helvetica');
            doc.text('Part Added', 415.8, 433.8 + 12, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            480.8, 433.8 + 12, {
                width: 105,
                height: 2,
                underline: true
            })
            doc.text('Date', 415.8, 433.8 + 30, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            443, 433.8 + 30, {
                width: 142,
                height: 2,
                underline: true
            })

            // Part Added Box 2
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(410.8, 480.6, 179.6, 46.8).stroke()
            doc.font('Helvetica');
            doc.text('Part Added', 415.8, 480.6 + 12, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            480.8, 480.6 + 12, {
                width: 105,
                height: 2,
                underline: true
            })
            doc.text('Date', 415.8, 480.6 + 30, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            443, 480.6 + 30, {
                width: 142,
                height: 2,
                underline: true
            })

            // Part Added Box 3
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(410.8, 527.4, 179.6, 46.8).stroke()
            doc.font('Helvetica');
            doc.text('Part Added', 415.8, 527.4 + 12, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            480.8, 527.4 + 12, {
                width: 105,
                height: 2,
                underline: true
            })
            doc.text('Date', 415.8, 527.4 + 30, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            443, 527.4 + 30, {
                width: 142,
                height: 2,
                underline: true
            })

            // Part Added Box 4
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(410.8, 574.2, 179.6, 46.8).stroke()
            doc.font('Helvetica');
            doc.text('Part Added', 415.8, 574.2 + 12, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            480.8, 574.2 + 12, {
                width: 105,
                height: 2,
                underline: true
            })
            doc.text('Date', 415.8, 574.2 + 30, {
                align: 'left',
                width: 150,
            })
            doc.text('                                                                                                                    ',
            443, 574.2 + 30, {
                width: 142,
                height: 2,
                underline: true
            })

            // OEET ticket box
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.fontSize(11)
            doc.rect(464, 629.6, 126.7, 28).stroke()
            doc.text('OEET TICKET #', 410.8, 631.6, {
                align: 'center',
                width: 50,
            })

            // kit box
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(464, 657.6, 126.7, 28).stroke()
            doc.text('KIT #', 410.8, 667.6, {
                align: 'right',
                width: 50,
            })

            //parts box table
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.rect(21.2, 193.8, 383.8, 491).stroke()
            doc.font('Helvetica-Bold');
            doc.text('Parts Used', 35.2, 193.8 + 6, {
                align: 'left',
                width: 100,
            })
            doc.font('Helvetica');
            doc.text('Use back of the RO as needed', 21.2 + 191, 193.8 + 6, {
                align: 'left',
                width: 150,
            })
            doc.font('Helvetica-Bold');
            doc.text('Qty.', 27.2, 193.8 + 40, {
                align: 'left',
                width: 100,
            })
            doc.text('LINE/Part Number', 30.2 + 30.3, 193.8 + 40, {
                align: 'left',
                width: 100,
            })
            doc.text('Description', 210, 193.8 + 40, {
                align: 'left',
                width: 100,
            })
            doc.text('Amt', 22.2 + 35.3 + 105.4 + 178.9, 193.8 + 40, {
                align: 'left',
                width: 100,
            })

            // Parts used box
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            doc.lineWidth(.2)

            for(let x = 0; x < 19; x++) {
                let add = 17.6 * x;
                let y = 245 + add;
                if(products) {
                    if(products[x] == null) {
                        doc.rect(22.2, y, 35.3, 17.6).stroke()
                        doc.rect(22.2 + 35.3, y, 95.4, 17.6).stroke()
                        doc.rect(22.2 + 35.3 + 95.4, y, 178.9, 17.6).stroke()
                    } else {
                        doc.font('Helvetica');
                        doc.rect(22.2, y, 35.3, 17.6).stroke()
                        doc.text(products[x].amt, 32.2, y + 5, 35.3, 17.6, {
                            align: 'left',
                            width: 100,
                        })
                        doc.rect(22.2 + 35.3, y, 95.4, 17.6).stroke()
                        doc.text(products[x].part, 32.2 + 35.3, y + 5, 35.3, 17.6, {
                            align: 'left',
                            width: 100,
                        })
                        doc.rect(22.2 + 35.3 + 95.4, y, 178.9, 17.6).stroke()
                        doc.text(products[x].desc, 32.2 + 35.3 + 95.4, y + 5, 35.3, 17.6, {
                            align: 'left',
                            width: 100,
                        })
                    }
                    doc.rect(22.2 + 35.3 + 95.4 + 178.9, y, 50, 17.6).stroke()
                    doc.rect(22.2 + 35.3 + 95.4 + 178.9 + 50, y, 22, 17.6).stroke()
                } else {
                    doc.rect(22.2, y, 35.3, 17.6).stroke()
                    doc.rect(22.2 + 35.3, y, 95.4, 17.6).stroke()
                    doc.rect(22.2 + 35.3 + 95.4, y, 178.9, 17.6).stroke()
                    doc.rect(22.2 + 35.3 + 95.4 + 178.9, y, 50, 17.6).stroke()
                    doc.rect(22.2 + 35.3 + 95.4 + 178.9 + 50, y, 22, 17.6).stroke()
                }
            }
            doc.font('Helvetica');
            const msg = ['EPA', 'Shop Supplies', 'Labor Charges', 'Frieght Charges', 'TAX', 'TOTAL']
            const msg2 = ['303 EPA', '303 Supplies', '398 Labor']
            for(let x = 0; x < 6; x++) {
                let add = 17.6 * x;
                let y = 579 + add
                doc.rect(22.2, y, 35.3, 17.6).stroke()
                doc.rect(22.2 + 35.3, y, 95.4, 17.6).stroke()
                doc.text(msg2[x], 32.2 + 35.3, y + 5, {
                    align: 'left',
                    width: 110,
                })
                doc.rect(22.2 + 35.3 + 95.4, y, 123.9, 17.6).stroke()
                doc.rect(22.2 + 35.3 + 95.4 + 123.9, y, 127, 17.6).stroke()
                doc.text(msg[x], 32.2 + 35.3 + 95.4, y + 5, {
                    align: 'right',
                    width: 110,
                })
                if(x == 4 || x == 5) {
                    doc.font('Helvetica-Bold');
                    doc.text(msg[x], 32.2 + 35.3 + 95.4, y + 5, {
                        align: 'right',
                        width: 110,
                    })
                }
            }
            doc.lineWidth(1)
            doc.font('Helvetica');
            for(let x = 0; x < 6; x++) {
                let add = 17.6 * x;
                let y = 579 + add
                doc.lineWidth(.5)
                if(x == 2) {
                    doc.rect(22.2 + 35.3 + 95.4 + 123.9, y, 57, 17.6).stroke()
                    doc.text('hrs', 57.2 + 35.3 + 95.4 + 123.9, y + 5, {
                        align: 'left',
                        width: 100,
                    })
                } else {
                    doc.rect(22.2 + 35.3 + 95.4 + 123.9, y, 127, 17.6).stroke()
                }
            }
            doc.fontSize(10)
            doc.text("I authorize these repairs and I certify that I have Authority to act on behalf of the company list above. I understand that MSP Diesel Solutions has a 1-year warranty on all complete rebuilds or remanufactured pumps or injectors. This warranty covers all worksmanship and parts. This warranty will not cover contaminated fuel or mis-insulation. All injection components must be inspected before warranty claims are issued. MSP Diesel Solutions will not warranty any product that has been used in conjuction with Non-OEM engine programmers, such as Bully Dog, Edge Products and etc.", 22.2, 693.2, {
                width: 575,
                height: 65,
                align: 'left'
            })
            doc.font('Helvetica-Bold');
            doc.text("Authorized Signature:", 22.2, 760.2, {
                width: 200,
                height: 20
            })
            doc.text("                                                                                                                                                  ", 127, 760.2, {
                underline: true,
                width: 315,
                height: 20
            })


            doc.text(`"MSP Diesel Solutions will provide quality, dependable service while exceeding our customer's expections"`, 22.2, 775.2, {
                width: 580,
                height: 20,
                align: 'center'
            })
            serial++;
        }
        doc.end()
    })
}

export default createPDF;