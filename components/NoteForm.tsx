'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from 'react'


export default function NoteForm({ className }: { className: string}) {
    const [clicked, setClicked ] = useState<boolean>(false)

    const handleNoteClick = () => {
        setClicked(prev => !prev)
    }
    return (
        <div className={className}>
            <button 
                onClick={handleNoteClick}
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex flex-row items-center"
            >[+]</button>
            {clicked && (
                <div>
                    <textarea></textarea>
                    <button>Save Note</button>
                </div>
            )}
        </div>
    )
}