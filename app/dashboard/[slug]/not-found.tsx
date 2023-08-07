export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center relative justify-center">
            <p className=" text-4xl font-bold">404</p>
            <h1 className="font-bold text-2xl">Not Found</h1>
            <p>Work order not found, check with website administrators for more Information. This could have happened if the work order was canceled.</p>
        </div>
    )
}