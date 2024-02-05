import Board from "./components/Board"

export default async function Page() {
    return (
        <main className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <Board/>
        </main>
    )
}