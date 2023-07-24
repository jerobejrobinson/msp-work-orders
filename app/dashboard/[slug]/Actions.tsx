'use client'
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from "next/navigation"
import {  } from "next/navigation"


export default function AdminActions({wo, admin, testRes, billing}: {wo: any, admin: any, testRes: any, billing: any}) {
    const supabase = createClientComponentClient()
    const router = useRouter()

    // Start Shipping Label
    const [shippingLabelClick, setShippingLabelClick] = useState<boolean>(false)
    const [shippingFile, setShippingFile] = useState<File | null>(null)
    const handleShippingLabelClick = () => {
        setShippingLabelClick(prev => !prev)
    }
    const submitShippingLabel = async () => {
        if(!shippingFile) return "upload file"

        console.log(shippingFile)

        // Shipping file naming convention account-number_sl_date
        const { error } = await supabase.storage.from('public').upload(`shipping-labels/${shippingFile.name}`, shippingFile, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) return console.error(error.message)
        
        const { data } = await supabase.storage.from('public').getPublicUrl(`shipping-labels/${shippingFile.name}`)

        const { error: errorUpdate } = await supabase.from('work_order').update({last_update_at: new Date().toISOString(), return_shipping: data.publicUrl}).eq('id', wo.id)

        if(errorUpdate) return console.error(errorUpdate.message)

        handleShippingLabelClick()
        router.refresh()
    }
    // End Shipping Label
    // Start Notes 
    const [noteClicked, setNoteClicked ] = useState<boolean>(false)
    const [note, setNote] = useState<string | null>(null)
    const handleNoteClick = () => {
        setNoteClicked(prev => !prev)
    }
    const submitNote = async () => {
        // insert note to table with woid and admin id as foreign keys
        const { error: noteError } = await supabase.from('note').insert({wo_id: wo.id, admin_id: admin.id, note})
        if(noteError) return noteError
        handleNoteClick()
        router.refresh()
    }
    // End Notes
    // Start Work Order Number
    const [numberClicked, setNumberClicked ] = useState<boolean>(false)
    const [number, setNumber] = useState<string | null>(null)
    const handleNumberClick = () => {
        setNumberClicked(prev => !prev)
    }
    const updateWorkOrderNumber = async () => {
        const { error } = await supabase.from('work_order').update({number: number, last_update_at: new Date().toISOString()}).eq('id', wo.id)    
        if(error) return error
        handleNumberClick()
        router.refresh()
    }
    // End Order Order Number
    // Start Work Order Tests
    const [testClicked, setTestClicked ] = useState<boolean>(false)
    const [test, setTest] = useState<any | null>(null)
    const [testNote, setTestNote] = useState<string | null>(null)
    const handleTestClick = () => {
        setTestClicked(prev => !prev)
    }
    const handleTestResultSubmission = async () => {
        if(!test) return "upload file"
        const { error } = await supabase.storage.from('public').upload(`${wo.number}/test-results/${test.name}`, test, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) return console.error(error.message)
        
        const { data } = await supabase.storage.from('public').getPublicUrl(`${wo.number}/test-results/${test.name}`)

        const { error: errorUpload } = await supabase.from('test_result').insert({wo_id: wo.id, link: data.publicUrl, note: testNote, admin_id: admin.id})

        if(errorUpload) return console.error(errorUpload.message)

        const { error: errorUpdate } = await supabase.from('work_order').update({last_update_at: new Date().toISOString()}).eq('id', wo.id)

        if(errorUpdate) return console.error(errorUpdate.message)

        handleTestClick()
        router.refresh()
    }
    // End Work Order Tests
    // Start Billing
    const [billingClick, setBillingClick] = useState<boolean>(false)
    const [billingFile, setBillingFile] = useState<File | null>(null)
    const [billingAmount, setBillingAmount] = useState<string | null>(null)
    const [billingNotes, setBillingNotes] = useState<string | null>(null)
    const [billingInvoice, setBillingInvoice] = useState<string | null>(null)
    const handleBillingClick = () => {
        setBillingClick(prev => !prev)
    }
    const submitBillingInformation = async () => {
        if(!billingFile) return 'uploading file'
        const { error } = await supabase.storage.from('public').upload(`${wo.number}/billing/${billingFile.name}`, billingFile, {
            cacheControl: '3600',
            upsert: false
        })
        
        if(error) return console.error(error.message)

        const { data } = await supabase.storage.from('public').getPublicUrl(`${wo.number}/billing/${billingFile.name}`)

        const { error: errorUpload } = await supabase.from('billing').insert({wo_id: wo.id, link: data.publicUrl, notes: billingNotes, admin_id: admin.id, amount: billingAmount, approved: false, invoice: billingInvoice})

        if(errorUpload) return console.error(errorUpload.message)

        const { error: errorUpdate } = await supabase.from('work_order').update({last_update_at: new Date().toISOString()}).eq('id', wo.id)

        if(errorUpdate) return console.error(errorUpdate.message)

        handleBillingClick()
        router.refresh()
    }
    
    // End Billing
    // Start Images
    const uploadImg = async (img: File) => {
        const { error } = await supabase.storage.from('public').upload(`${wo.number}/${img.name}`, img, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) return console.error(error.message)

        console.log('upload 100%')
        
    }
    const [imagesBtn, SetImagesBtn] = useState<boolean>(false)
    const [imagesFiles, setImagesFiles] = useState<FileList | null>(null)
    const handleImgBtn = () => {
        SetImagesBtn(prev => !prev)
    }
    const submitImages = async () => {
        if(!imagesFiles) return console.error('upload images')
        Array.from(imagesFiles).forEach(async (img) => {
            await uploadImg(img)
        })
    }
    // End Images
    return (
        <div className="w-full max-w-7xl py-8">
            <div className="w-full flex justify-between">
                <Link
                    href="/dashboard"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
                >
                    back
                </Link>
                <div className="flex flex-row gap-4">
                {/* Start Return Shipping Action */}
                {wo.return_shipping ? '' : !shippingLabelClick ? (
                    <BtnAction click={handleShippingLabelClick} name="Shipping Label" />
                ):(<BtnOptions click={handleShippingLabelClick} submit={submitShippingLabel} name="Shipping Label" />)}
                {/* End Return Shipping Action */}
                {/* Start Add Note Action */}
                {!noteClicked ? (
                    <BtnAction click={handleNoteClick} name="Note" />
                ):(<BtnOptions click={handleNoteClick} submit={submitNote} name="Note" />)}
                {/* End Add Note Action */}
                {/* Start Add Images  */}
                {wo.number === "pending" ? '' : !imagesBtn ? (
                    <BtnAction click={handleImgBtn} name="Images" />
                ): (<BtnOptions click={handleImgBtn} submit={submitImages} name="Images" />)}
                {/* End Add Images  */}
                {/* Start Add Work Order Number */}
                {!numberClicked && wo.number === "pending" ? ( 
                    <BtnAction click={handleNumberClick} name="Work Order Number" /> )
                : wo.number === "pending" ? (<BtnOptions click={handleNumberClick} submit={updateWorkOrderNumber} name="Work Order Number" />) : ('')}
                {/* End Add Note Action */}

                {/* Start Upload Test Reseults */}
                    {(wo.number === "pending" || testRes?.length) ? '' 
                    : !testClicked ? ( <BtnAction click={handleTestClick} name="Test Results" /> )
                    : (<BtnOptions click={handleTestClick} submit={handleTestResultSubmission} name="Test Results" />)}
                {/* End Upload Test Reseults */}
                {/* Start Upload Billing */}
                    {testRes?.length && !billingClick ? ( <BtnAction click={handleBillingClick} name="Billing" /> )
                    : (<BtnOptions click={handleBillingClick} submit={submitBillingInformation} name="Billing" />)}
                {/* End Upload Billing */}
                </div>
            </div>
            {noteClicked && (
                <div className="w-full p-4">
                    <textarea 
                    name="note" 
                    id="note" 
                    className="w-full border rounded p-4 outline-0" 
                    rows={7}
                    onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>
            )}
            {shippingLabelClick && (
                <div className="w-full p-4">
                    <p>Upload PDF File</p>
                    <input type="file" name="shippingFile" id="shippingFile" onChange={(e) => {
                        if(e.target.files !== null)
                        setShippingFile(e.target.files[0])
                    }}/>
                </div>
            )}
            {numberClicked && (
                <div className="w-full p-4">
                    <input type="text" name="number" id="number" onChange={(e) => setNumber(e.target.value)} className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white w-full"/>
                </div>
            )}
            {testClicked && (
                <div className="w-full p-4">
                    <p>Upload PDF File</p>
                    <input type="file" name="testFile" id="testFile" onChange={(e) => {
                        if(e.target.files !== null)
                        setTest(e.target.files[0])
                    }}/>
                    <p>Test Note</p>
                    <textarea 
                        name="note" 
                        id="note" 
                        className="w-full border rounded p-4 outline-0" 
                        rows={7}
                        onChange={(e) => setTestNote(e.target.value)}
                    ></textarea>
                </div>
            )}
            {billingClick && (
                <div className="w-full p-4">
                    <p>Upload PDF File</p>
                    <input 
                        type="file" 
                        name="billingFile" 
                        id="billingFile" 
                        onChange={(e) => {
                            if(e.target.files !== null)
                            setBillingFile(e.target.files[0])
                        }}
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white"
                    />
                    <p>Amount</p>
                    <input 
                        type="number" 
                        name="billingAmount" 
                        id="billingAmount" 
                        onChange={(e) => setBillingAmount(e.target.value)}
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white" 
                    />
                    <p>CSD Invoice Number</p>
                    <input 
                        type="text" 
                        name="billingInvoice" 
                        id="billingInvoice" 
                        onChange={(e) => setBillingInvoice(e.target.value)}
                        className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-white" 
                    />
                    <p>Notes</p>
                    <textarea 
                        name="note" 
                        id="note" 
                        className="w-full border rounded p-4 outline-0" 
                        rows={7}
                        onChange={(e) => setBillingNotes(e.target.value)}
                    ></textarea>
                </div>
            )}
            {imagesBtn && (
                <div className="w-full p-4">
                    <p>Upload Images File</p>
                    <input type="file" name="imageFile" id="imageFile" onChange={(e) => {
                        if(e.target.files !== null)
                        setImagesFiles(e.target.files)
                    }} multiple/>
                </div>
            )}

        </div>
    )
}

function BtnOptions({click, submit, name}: {click: any, submit: any, name: string}) {
    return (
        <>
            <button
                className="py-2 px-4 rounded-md no-underline bg-main hover:bg-btn-background-hover flex flex-row items-center"
                onClick={click}
            >
                Cancel Action
            </button>
            <button
                className="py-2 px-4 rounded-md no-underline bg-btn-background flex flex-row items-center bg-greenLight text-white"
                onClick={submit}
            >
                Submit {name}
            </button>
        </>
    )
}

function BtnAction({click, name}: {click: any, name: string}) {
    return (
        <button
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
            onClick={click}
        >
            Add {name}
        </button>
    )
}