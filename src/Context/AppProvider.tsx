import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getFolders } from "../Api/Api";
import type { folder } from "../component/types/Types";
import type { AppContextType } from "./AppContext";
import { AppContext } from "./AppContext";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<folder | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AppContextType["activeView"]>(null); 
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNoteMode, setActiveNoteMode] = useState<"view" | "create">("view");


  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        const data = res?.data?.folders ?? res?.data?.data ?? [];
        const foldersArray = Array.isArray(data) ? data : [];
        setFolders(foldersArray);

        if (foldersArray.length > 0 && !selectedFolder) {
          setSelectedFolder(foldersArray[0]);
        }
      } catch (err) {
        console.error(err);
        setFolders([]);
      }
    };
    fetchFolders();
  }, []);

  return (
    <AppContext.Provider
      value={{
        folders,
        setFolders,
        selectedFolder,
        setSelectedFolder,
        activeView,
        setActiveView,
        showNewNoteForm,
        setShowNewNoteForm,
        selectedNoteId,
        setSelectedNoteId,
        refreshNotes,
        setRefreshNotes,
        searchOpen,
        setSearchOpen,
        activeNoteMode,
        setActiveNoteMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};