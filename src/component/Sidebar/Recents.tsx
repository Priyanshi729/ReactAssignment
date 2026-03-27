import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import { useApp } from '../../Context/useApp'
import { getNotes, updateNoteTitle } from '../../Api/Api';
import type { Note } from '../../Context/AppContext';



const Recents: React.FC = () => { 
    const {
        recentNotes,
        setNotes,
        loadingNotes,
        errorNotes,
        activeNoteId,
        setActiveNoteId,
        setActiveFolder
    }= useApp();

    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("")





    //Update Function 
    const updateNote = async (id: string) => {
    if (!editTitle.trim()) {
      setEditId(null);
      return;
    }

    try {
      await updateNoteTitle(id, editTitle); 
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, title: editTitle } : note))
      );
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setEditId(null);
    }
  };

  const handleNotesClick = async (note: Note) => {
    setActiveNoteId(note.id);
    setActiveFolder(note.folderId, note.folderName);
    
    if (note.folderId) {
        try {
            const notes = await getNotes(note.folderId);
            setNotes(notes);
        } catch (err) {
            console.error("Error fetching notes", err);
        }
    }
}

    return (
        <div style={{ fontFamily: "var(--font-primary)" }} className='w-80 h-39.5 -950 pl-6 pt-2'>
            <p style={{ fontFamily: "var(--font-primary)" }} className='text-(--text-bg) font-semibold text-sm '>Recents</p>
            

            {loadingNotes && <p className='text-(--text-bg) text-base font-semibold'>Loading</p>}
            {errorNotes && <p className='text-sm text-(--error-bg)'>{errorNotes}</p>}


            {recentNotes.map((note) => {

                const isActive = activeNoteId === note.id
                const isEditing = editId === note.id

                return (
                    <div key={note.id}
                        onClick={() => handleNotesClick(note)}
                        style={{ fontFamily: "var(--font-primary)" }}
                        className={`flex items-center gap-3.75 pt-2.5 pr-5 pb-2.5 cursor-pointer ${isActive ? 'text-(--isActive-bg)' : 'text-(--text-bg)'}`}>

                        <FileText className='w-5 h-5 text(--text-bg)' />

                        {isEditing ? (<input
                            value={editTitle}
                            autoFocus
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => updateNote(note.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") updateNote(note.id)
                                if (e.key === "Escape") setEditId(null)
                            }}
                            style={{ fontFamily: "var(--font-primary)" }} 
                            className="bg-( --sidebar-bg) text-base px-1 rounded outline-none text-white"
                            required/>
                        ) : (
                            <p onDoubleClick={() => {
                                setEditId(note.id)
                                setEditTitle(note.title)
                            }}
                                style={{ fontFamily: "var(--font-primary)" }}
                                className={`text-base font-semibold ${isActive ? 'text-(--isActive-bg)' : 'text-(--text-bg)'}`}>
                                {note.title}
                            </p>
                        )}

                    </div>
                )
            })}
        </div>

    )
}

export default Recents