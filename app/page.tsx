import Link from "next/link"
import Image from "next/image"
export default async function Index() {
  

  return (
    <>
      <div className=" h-main mt-16 flex flex-row items-center justify-center space-x-16">
        {/* max width 495 */}
        <div className="w-full max-w-xl space-y-8">
          <h1 className="text-4xl font-bold">Expert Fuel Injector and Pump Repair/Reman Services!</h1>
          <p>Welcome to MSP Diesel Solutions R&R Program, your one-stop shop for top-quality fuel injector and pump repair and re-manufacturing services. We understand the importance of a well-functioning engine, and our skilled technicians are dedicated to reviving your vehicle's performance with precision and care.</p>
          <div>
            <Link
              href="/login"
              className="bg-main text-white rounded p-4"
            >Create Account To Get Started</Link>
          </div>
          <p className="text-sm"><em>We offer 3 turn-around on testing and work service. Sign up for a account to get started!</em></p>
        </div>
        <div>
          <Image
            src="/images/msp_office.jpg"
            alt="MSP Diesel Solutions Main Building"
            width={495}
            height={512}
          />
        </div>
      </div>
      <div className=" h-main mt-16 flex flex-row items-center justify-center flex-wrap">
        <h2 className="text-4xl font-bold basis-full text-center">How It Works</h2>
        <div className="mr-16">
          <Image
            src="/images/msp_warehouse.jpg"
            alt="MSP Diesel Solutions Warehouse"
            width={495}
            height={512}
          />
        </div>
        <div className="w-full max-w-xl space-y-4">
          <ol className="space-y-4">
            <li><strong>Work Order Submission</strong>: Submit a work order request online, from there we when send you a shipping with in 30 minutes.</li>
            <li><strong>Shiping Out</strong>: Ship your parts free of charge using our shipping label.</li>
            <li><strong>Testing</strong>: Our skilled technicians will conduct a thorough assessment to determine the best course of action.</li>
            <li><strong>Repair/Reman</strong>: We apply state-of-the-art techniques and replace worn parts to restore your fuel injectors and pumps to optimal conditions.</li>
            <li><strong>Delivered to Your Doorstep</strong>: Once complete, we promptly deliver your revitalized components, ready to breathe new life into your vehicle.</li>
          </ol>
        </div>
        <div className="basis-full text-center">
          <p className="max-w-3xl mx-auto">Don't let engine troubles hold you back. Unlock the full potential of your vehicle with our expert fuel injector and pump remanufacturing services. Join countless satisfied customers who have experienced the exceptional results we deliver.</p>
        </div>
      </div>
      <footer className="bg-[#1c1a33] text-white text-center p-4 mt-20">
        <p className="text-xl font-bold">Contact us now to discuss your needs and let our dedicated team get your engine roaring again!</p>
        <div className="flex flex-row w-full justify-between mt-16">
          <p>phone: <a href="tel:19013960710">(901) 396-0710</a></p>
          <p>email: <a href="mailto:mspfuelinjectionrepair@mspdieselsolutions.com">mspfuelinjectionrepair@mspdieselsolutions.com</a></p>
        </div>
      </footer>
    </>
  )
}
