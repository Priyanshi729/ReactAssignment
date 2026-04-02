import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { folder } from "../component/types/Types";

export type AppContextType = {
  selectedFolder: folder | null;
  setSelectedFolder: (folder: folder | null) => void;

  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  activeNoteMode: "view" | "create";
  setActiveNoteMode: (mode: "view" | "create") => void;

  refreshNotes: boolean;
  setRefreshNotes: Dispatch<SetStateAction<boolean>>;

  activeView: "all"| "favorites" | "archived" | "trash" | null;
  setActiveView: (view:  "favorites" | "archived" | "trash" | null) => void;

  folders: folder[];
  setFolders: Dispatch<SetStateAction<folder[]>>;

  showNewNoteForm: boolean;
  setShowNewNoteForm: (val: boolean) => void;

  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
};


export const AppContext = createContext<AppContextType | null>(null);