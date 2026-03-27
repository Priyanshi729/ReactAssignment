import React, { useEffect, useState } from 'react'
import { useApp } from '../../Context/useApp';
import { getNotes } from '../../Api/Api';


const NoteItem: React.FC= ()=> { 
    const {
        activeFolderId,
        activeFolderName,
        activeNoteId,
        setActiveNoteId,
        folderNotes,
        setNotes
    } = useApp();

    const [loading,setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (!activeFolderId) return;

        const fetchNotes = async () => {
            try {
                setLoading(true);

                const res = await getNotes(activeFolderId);
                setNotes(res);
                
            } catch (err: unknown) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [activeFolderId,setNotes,setActiveNoteId]);

    return (
        <div className="w-89 h-screen px-4 pb-4 overflow-y-auto ">

            
                <p className="text-lg font-semibold text-(--isActive-bg) pt-2 py-6">
                    {activeFolderName || "Select Folder"}
                </p>
           

            {loading && <p>Loading...</p>}
            <div className="flex flex-col gap-4">
                {folderNotes.map((note) => (
                    <div
                        key={note.id}
                        onClick={()=>setActiveNoteId(note.id)}
                        className={`flex flex-col gap-2.5 w-77.5 h-24.5 p-4  rounded-lg  ${activeNoteId === note.id ? 'bg-(--note-a-bg)' : 'bg-(--bg-mid)'}`}>
                        <p className="font-semibold text-lg text-(--isActive-bg) ">{note.title}</p>
                        <div className='flex gap-4 '>
                            <p className="text-base text-(--date-bg)">
                                {new Date(note.createdAt).toLocaleDateString("en-GB")}
                            </p>
                            <p className='text-base  text-(--content-bg) truncate'>{note.preview}</p>
                        </div>

                    </div>

                ))}
            </div>
        </div>

    )
}

export default NoteItem