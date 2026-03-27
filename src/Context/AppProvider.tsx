import React, { useState, useEffect } from "react";
import { AppContext, type Folder, type Note } from "./AppContext";
import { createNewFolder, getFolders, getRecents } from '../Api/Api';




export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    //created states
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loadingFolders, setLoadingFolders] = useState<boolean>(false);
    const [errorFolders, setErrorFolders] = useState<string>("")

    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [activeFolderName, setActiveFolderName] = useState<string>("");


    const [folderNotes, setFolderNotes] = useState<Note[]>([]);
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [errorNotes, setErrorNotes] = useState("");
    

    const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
    

    //Fetch folders
    useEffect(() => {
        const fetchFolders = async () => {
            try {

                setLoadingFolders(true);
                setErrorFolders("");

                const data = await getFolders();
                setFolders(data);
                if (data.length > 0) {
                        setActiveFolder(data[0].id, data[0].name); 

                }
            }
            catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorFolders(err.message);
                } else {
                    setErrorFolders("Something went wrong");
                }
            } finally {
                setLoadingFolders(false)
            }
        };
        fetchFolders();
    }, [])


    //Fetch Recents 
    useEffect(() => {
        const fetchRecents = async () => {
            try {
                setLoadingNotes(true);
                setErrorNotes("");

                const res = await getRecents();
                setRecentNotes(res);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorNotes(err.message);
                } else {
                    setErrorNotes("Something went wrong");
                }
            } finally {
                setLoadingNotes(false)
            }
        }
        fetchRecents();
    }, [])


    const createFolder = async (name: string) => {
        try {
            await createNewFolder(name);
            const updatedFolders = await getFolders();
            setFolders(updatedFolders);
            setActiveFolderId(updatedFolders[0].id)
            setActiveFolderName(updatedFolders[0].name)
            setActiveNoteId(null);
        } catch (err) {
            console.error("Failed to create folder:", err);
        }
    };


    //when folder will change it will get called to change the activeFolder
    const setActiveFolder = (id: string , name: string) => {
        setActiveFolderId(id);
        setActiveFolderName(name);
        setActiveNoteId(null);
    }



    return (
        <AppContext.Provider
            value={{
                folders,
                loading: loadingFolders,
                error: errorFolders,
                activeFolderId,
                activeFolderName,
                setActiveFolder,
                createFolder,
                activeNoteId,
                setActiveNoteId,
                folderNotes,
                recentNotes,
                setNotes : setFolderNotes,
                loadingNotes,
                errorNotes,
                
                
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
