'use client'
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function CustomerForm() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [formState, setFormState] = useState<{
        first_name: String | null,
        last_name: String | null,
        address: String | null,
        address_2: String | null,
        city: String | null,
        state: String | null,
        zip: Number | null,
        country: String | null,
        phone: Number | null,
        account_number: Number | null,
        company_name: String | null
    }>({
        first_name: null,
        last_name: null,
        address: null,
        address_2: null,
        city: null,
        state: null,
        zip: null,
        country: null,
        phone: null,
        account_number: null,
        company_name: null,
    })
    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()

        if(!user) return null

        const { data, error } = await supabase
            .from('customer')
            .insert([{...formState, user_id: user.id}])
            .select()


        if(error) return console.error(error)

        if(data) router.refresh()
    }
    return (
        <div className="flex flex-col max-w-3xl w-full px-4">
          <section className='pt-20'>
            <h1 className='text-xl font-bold'>Edit Profile Information</h1>
            <p>Please enter all information to submit a work order ticket.</p>
          </section>
          <form 
            onSubmit={handleFormSubmission}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-foreground w-full py-20"
          >
            <div className='flex flex-col md:col-span-2'>
              <label className="text-md" htmlFor="first-name">
                First Name
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, first_name: e.target.value}})} type="text" name="first-name" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col md:col-span-2'>
              <label className="text-md" htmlFor="last-name">
                Last Name
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, last_name: e.target.value}})} type="text" name="last-name" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col sm:col-span-2 md:col-span-3'>
              <label className="text-md" htmlFor="address">
                Address
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, address: e.target.value}})} type="text" name="address" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col md:col-span-1'>
              <label className="text-md" htmlFor="address-2">
                Address 2
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, address_2: e.target.value}})} type="text" name="address-2" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col sm:col-start-1 md:col-span-2'>
              <label className="text-md" htmlFor="city">
                City
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, city: e.target.value}})} type="text" name="city" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col'>
              <label className="text-md" htmlFor="state">
                State
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, state: e.target.value}})} type="text" name="state" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col'>
              <label className="text-md" htmlFor="zip">
                Zip
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, zip: Number(e.target.value)}})} type="text" name="zip" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col md:col-span-2'>
              <label className="text-md" htmlFor="country">
                Country
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, country: e.target.value}})} type="text" name="country" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col md:col-span-2'>
              <label className="text-md" htmlFor="phone">
                Phone
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, phone: Number(e.target.value)}})} type="tel" name="phone" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col  sm:col-span-2'>
              <label className="text-md" htmlFor="account-number">
                Account Number
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, account_number: Number(e.target.value)}})} type="text" name="account-number" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <div className='flex flex-col sm:col-span-2'>
              <label className="text-md" htmlFor="company_name">
                Company
              </label>
              <input onChange={(e) => setFormState(prev => {return {...prev, company_name: e.target.value}})} type="text" name="company_name" className="rounded-md px-4 py-2 bg-inherit border mb-6"/>
            </div>
            <button className="bg-[#e8523d] rounded px-4 py-2 text-black mb-6 sm:col-span-full">
              Submit
            </button>
          </form>
        </div>
    )
}