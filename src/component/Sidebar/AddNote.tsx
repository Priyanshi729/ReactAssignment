import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../../Context/useApp'
import { useNavigate } from 'react-router-dom'

const AddNote: React.FC = () => {
    const { 
        setSelectedNoteId,   
        searchOpen, 
        folders,
        setSelectedFolder,   
        setSearchOpen
    } = useApp();

    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleAddNote = () => {
        navigate("/note/new"); 
    };

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelectFolder = (id: string, name: string) => {
        setSelectedFolder({ id, name });  

        setSelectedNoteId(null);   
        navigate("/"); 
        setSearchOpen(false);
        setQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (filteredFolders.length > 0) {
                const f = filteredFolders[0];
                handleSelectFolder(f.id, f.name);
            } else {
                setSearchOpen(false);
                setQuery("");
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='pl-6' ref={wrapperRef}>
            {searchOpen ? (
                <div> 
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search folders..."
                        className='h-10 w-65 px-3 rounded bg-(--button-bg) text-white outline-none'
                        autoFocus
                    />

                    {query && (
                        <div className="mt-2 bg-gray-800 rounded p-2 w-65 max-h-40 overflow-y-auto">
                            {filteredFolders.length > 0 ? (
                                filteredFolders.map(folder => (
                                    <div
                                        key={folder.id}
                                        onClick={() => handleSelectFolder(folder.id, folder.name)}
                                        className="p-2 hover:bg-gray-700 cursor-pointer rounded text-(--add-bg)"
                                    >
                                        {folder.name}
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
                    className='h-10 w-65 bg-(--button-bg) rounded  text-center font-semibold text-(--add-bg) text-base'
                >
                    + New Note
                </button>
            )}
        </div>
    );
};

export default AddNote; 