import  { createContext } from 'react'



export type Folder = {
    id: string;
    name: string;
}

export type Note = {
    id : string;
    title : string;
    createdAt : string;
    preview : string;
    content : string;
    folderId : string;
    folderName : string;
    
}

export type AppContextType = {
    folders: Folder[];
    loading: boolean;
    error: string;

    activeFolderId: string | null;
    activeFolderName: string;
    setActiveFolder: (id: string, name: string) => void;
    createFolder : (name : string) => Promise<void>;

    folderNotes : Note[];
    recentNotes : Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    loadingNotes : boolean;
    errorNotes : string ; 

    

    activeNoteId: string | null;
    setActiveNoteId: (id: string | null) => void;

    
}

export const AppContext = createContext<AppContextType | null>(null);


