import React, { useState } from 'react'
import { Folder as FolderIcon, FolderPlus, FolderOpen } from 'lucide-react'
import { useApp } from '../../Context/useApp';

const Folder: React.FC = () => {
    const { folders, loading, error, activeFolderId, setActiveFolder,createFolder } = useApp();
    
    const [showInput,setShowInput] = useState(false);
    const [newFolderName,setNewFolderName] = useState("");

    const handleAddFolder = async()=>{
        if(!newFolderName.trim()) return ;
        await createFolder(newFolderName);
        setNewFolderName("");
        setShowInput(false);
    }


    return (
        <div className='w-80 h-64 pl-3 pr-6 overflow-y-auto'>

           
            <div className='flex items-center justify-between mb-3 sticky top-0 bg-(--sidebar-bg) z-10'>
                <p
                    style={{ fontFamily: "var(--font-primary)" }}
                    className='text-(--text-bg) text-sm font-semibold pl-3'
                >
                    Folders
                </p>

                <FolderPlus onClick={()=>setShowInput(true)}
                            className='w-5 h-5 cursor-pointer text-(--text-bg) hover:text-white transition' />
            </div>
            {showInput && (
                <div className='py-3'>
                    <input 
                     type='text'
                     autoFocus
                     value={newFolderName}
                     onChange={(e)=>setNewFolderName(e.target.value)}
                     onKeyDown={(e)=>{
                        if(e.key === "Enter") handleAddFolder();
                        if(e.key === "Escape") setShowInput(false);
                     }}
                     placeholder='New Folder'
                     className='text-base px-2 py1 rounded outline-none bg-(--bg-mid) text-(--text-bg)'  
                    />
                </div>
            )

            }

            {loading && (
                <p className='text-(--text-bg) text-sm px-3'>Loading...</p>
            )}

            
            {error && (
                <p
                    style={{ fontFamily: "var(--font-primary)" }}
                    className='text-sm text-(--error-bg) px-3'
                >
                    {error}
                </p>
            )}

            
            {!loading && !error && folders.map((item) => {
                const isActive = activeFolderId === item.id;
                const Icon = isActive ? FolderOpen : FolderIcon;

                return (
                    <div
                        key={item.id}
                        onClick={() => setActiveFolder(item.id, item.name)}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition
                        ${isActive ? 'text-(--isActive-bg) bg-(--bg-Active)' : 'text-(--text-bg)'}`}
                    >
                        <Icon
                            className={`w-5 h-5 ${isActive ? 'text-(--isActive-bg)' : 'text-(--text-bg)'}`}
                        />

                        <p
                            style={{ fontFamily: "var(--font-primary)" }}
                            className={`text-base font-semibold
                            ${isActive ? 'text-(--isActive-bg)' : 'text-(--text-bg)'}`}
                        >
                            {item.name}
                        </p>
                    </div>
                );
            })}

            
            {!loading && !error && folders.length === 0 && (
                <p className='text-(--text-bg) text-sm px-3'>No folders</p>
            )}

        </div>
    )
}

export default Folder