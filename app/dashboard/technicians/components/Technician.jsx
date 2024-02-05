import Image from "next/image"
export default function Technician({ tech }) {
    return (
        <div className="border shadow rounded">
            <div className="flex flex-row justify-between p-4">
                <div>
                    <p className="font-bold">Name</p>
                    <p>{tech.name}</p>
                </div>
                <div>
                    <p className="font-bold">Section</p>
                    <p>{tech.type}</p>
                </div>
            </div>
            <div className="bg-gray-200 p-4 flex flex-col justify-center items-center">
                <img src={`http://bwipjs-api.metafloor.com/?bcid=code128&text=${tech.number}&parsefnc&alttext=${tech.number}`} width={100} height={100} alt={`badge for ${tech.name}`}/>
            </div>
        </div>
    )
}