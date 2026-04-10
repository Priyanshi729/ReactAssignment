import { getNotes } from '../../Api/Api'
import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../../Context/useApp'
import { useNavigate } from 'react-router-dom'
import type { Note } from '../types/Types'

const AddNote: React.FC = () => {
    const { 
        setSelectedNoteId,   
        searchOpen,   
        setSearchOpen,
        setSelectedFolder,
    } = useApp()

    const navigate = useNavigate()

    const [notes,setNotes] = useState<Note[]>([])
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const wrapperRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    useEffect(()=>{
        const fetchNotes = async()=>{
            if(!debouncedQuery.trim()){
                setNotes([])
                return
            }
            try{
                const res = await getNotes({search : debouncedQuery })
                const data = res?.data?.notes ?? res?.data?.data ?? []
                setNotes(data)
            }catch(err){
                console.error(err)
                setNotes([])
            }
        }
        fetchNotes();
    },[debouncedQuery])

    const handleAddNote = () => {
        navigate("/note/new") 
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    )

    const handleSelectNote = (note : Note) => {
        setSelectedNoteId(note.id)   

        if (note.folderId) {
        setSelectedFolder({
            id: note.folderId,
            name: note.folder?.name || "Folder"
        })
    }
        navigate(`/folder/${note.folderId}/note/${note.id}`) 
        setSearchOpen(false)
        setQuery("")
        setDebouncedQuery("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (filteredNotes.length > 0) {
                const n = filteredNotes[0]
                handleSelectNote(n)
            } else {
                setSearchOpen(false)
                setQuery("")
                setDebouncedQuery("")
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setSearchOpen(false)
                setQuery("")
                setDebouncedQuery("")
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [setSearchOpen])

    const isTyping = query !== debouncedQuery

    return (
        <div className='pl-6' ref={wrapperRef}>
            {searchOpen ? (
                <div> 
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search Notes..."
                        className='h-10 w-65 px-3 rounded bg-(--button-bg) text-(--add-bg) outline-none focus:outline-none focus:ring-0'
                        autoFocus
                    />

                    {query && (
                        <div className="mt-2 bg-gray-800 rounded p-2 w-65 max-h-40 overflow-y-auto">
                            {isTyping ? (
                                <div className="p-2 text-gray-400">Searching...</div>
                            ) : filteredNotes.length > 0 ? (
                                filteredNotes.map(note => (
                                    <div
                                        key={note.id}
                                        onClick={() => handleSelectNote(note)}
                                        className="p-2 hover:bg-gray-700 cursor-pointer rounded text-(--add-bg)"
                                    >
                                        {note.title}
                                    </div>
                                ))
                            ) : (
                                <div className="p-2 text-gray-400">No results</div>
                            )}
                        </div>
                    )}
                </div>  
            ) : (
                <button
                    onClick={handleAddNote}
                    className='h-10 w-65 bg-(--button-bg) rounded text-center font-semibold text-(--add-bg) text-base'
                >
                    + New Note
                </button>
            )}
        </div>
    )
}

export default AddNote