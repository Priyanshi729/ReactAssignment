import React from 'react'
import { useApp } from '../../Context/useApp'



const AddNote: React.FC = () => {
    const {setActiveNoteId} = useApp();

    const handleAddNote = ()=>{
        setActiveNoteId("new")
    }

    return (
        <div className='pl-6 '>
            <button onClick={handleAddNote}
                style={{ fontFamily: "var(--font-primary)" }}
                className='h-10 w-65 bg-(--button-bg) text-center font-semibold text-(--add-bg) text-base hover:cursor-pointer'>+ New Note</button>
        </div>

    )
}

export default AddNote