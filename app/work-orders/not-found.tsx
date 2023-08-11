import Link from "next/link"
export default function NotFound() {
    return (
        <div className="h-main mt-16 flex flex-col items-center justify-center space-y-4">
            <p>Your customer profile has not been set up please click the link below to continue.</p>
            <Link
                href="/profile"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
            >
                Add Customer Profile
            </Link>
        </div>
    )
}